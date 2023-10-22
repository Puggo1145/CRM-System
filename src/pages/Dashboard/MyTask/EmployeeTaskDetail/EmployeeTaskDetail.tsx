import { useState, useEffect } from "react";
import makeRequest from "../../../../utils/makeRequest";
import { useLocation } from "react-router-dom";
import { usePrompt } from "../../../../components/prompts/PromptContext";
import PubSub from "pubsub-js";

import TaskTargetDetail from "./TaskTargetDetail/TaskTargetDetail";

import keyTransformer from "../../../../utils/keyTransformer";
import { taskStatusColor } from "../../../../utils/handleStatusColor";
import { teacherStatusColor, studentStatusColor } from "../../../../utils/handleStatusColor";

import useUrl from "../../../../store/urls";

import { TaskType } from "../../TaskCenter/TaskBoard/TaskBoard";
import { teacherDataType, studentDataType, taskTargetObjType } from "../../../../types/createDataModeltype";

import './EmployeeTaskDetail.css';

import backIcon from '../../../../static/common/back.png';

export default function employeeTaskDetail() {

  const location = useLocation();
  const { showPrompt, showCheck } = usePrompt();

  const backendUrl = useUrl(state => state.backendUrl);

  const [taskBasicInfo, setTaskBasicInfo] = useState<Partial<TaskType>>({
    task_name: "加载中",
    task_target: "加载中",
    status: "加载中",
    task_remark: "加载中",
    create_time: "加载中",
    deadline: "加载中",
  });
  const [taskTargetObjs, setTaskTargetObjs] = useState<Partial<teacherDataType & studentDataType & taskTargetObjType>[]>([]);
  const [omitFields] = useState<string[]>([
    "taskTargetObj_id", "task_id", "school_id", "teacher_id", "student_id", "create_time", "teacher_remark", "student_remark"
  ]);

  // 当前选择查看的任务对象，作为 TaskTargetDetail 组件显示的内容
  const [currentTaskTargetobj, setCurrentTaskTargetobj] = useState<Partial<teacherDataType & studentDataType>>({});
  const [isTaskTargetDetailShow, setIsTaskTargetDetailShow] = useState<boolean>(false);

  useEffect(() => {
    const token = PubSub.subscribe('updateTaskTargetObjs', (data) => {
      updateTaskTargetObjs();
    });

    updateTaskTargetObjs();

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);
  const updateTaskTargetObjs = async () => {
    const task_id = location.pathname.split('/').pop();

    const res = await makeRequest({
      method: 'GET',
      url: `${backendUrl}/api/v1/tasks/employee/${task_id}`
    });

    if (!('error' in res)) {
      const task = res.data.data.task;
      setTaskBasicInfo({
        task_id: task.task_id,
        task_name: task.task_name,
        task_target: task.task_target,
        status: task.status,
        task_remark: task.task_remark,
        create_time: task.create_time,
        deadline: task.deadline,
      });
      setTaskTargetObjs(res.data.data.taskTargetObjs);

    } else {
      showPrompt({
        content: res.error,
        type: 'error',
      });
    }
  };

  const checkTask = async () => {
    if (taskBasicInfo.status === '待确认') {
      const result = await showCheck("点击确定即代表您认可此任务的内容，请确保已经仔细阅读任务的内容！点击确定以确认任务");

      if (result) {
        const res = await makeRequest({
          method: 'PATCH',
          url: `${backendUrl}/api/v1/tasks/employee/${taskBasicInfo.task_id}`,
          data: {
            status: "进行中"
          }
        });

        if (!('error' in res)) {
          showPrompt({
            content: "任务确认成功",
            type: "success"
          });
          setTaskBasicInfo({
            ...taskBasicInfo,
            status: "进行中"
          });
        } else {
          showPrompt({
            content: res.error,
            type: "error"
          });
        }
      }
    };
  };

  const enterTaskTargetObjDetail = (taskTargetObj: Partial<studentDataType | teacherDataType>) => {
    if (taskBasicInfo.status === '待确认') {
      return showPrompt({
        content: "请先确认任务内容",
        type: "error"
      });
    } else if (taskBasicInfo.status === '待审核') {
      return showPrompt({
        content: "任务已提交，无法修改",
        type: "error"
      });
    };

    setCurrentTaskTargetobj(taskTargetObj);
    setIsTaskTargetDetailShow(true);
  };

  const handleTaskSubmit = async () => {
    // 1. 检查任务状态
    const unfinishedTaskNum = taskTargetObjs.filter(item =>
      taskBasicInfo.task_target === "班主任" ?
        item.teacher_status === '对接中'
        :
        item.student_status === '对接中'
    ).length;

    if (unfinishedTaskNum > 0 ) {
      return showCheck('还有在进行中的任务对象，无法提交！请将其状态修改为"对接中"以外的其他状态后再提交');
    }
    const result = await showCheck("任务提交后将无法修改，确定要提交吗？");
    if (!result) return;

    const res = await makeRequest({
      method: 'PATCH',
      url: `${backendUrl}/api/v1/tasks/employee/${taskBasicInfo.task_id}`,
      data: {
        status: "待审核"
      }
    });

    if (!('error' in res)) {
      showPrompt({
        content: "提交成功",
        type: "success"
      });
      setTaskBasicInfo({
        ...taskBasicInfo,
        status: "待审核"
      });
    } else {
      showPrompt({
        content: res.error,
        type: "error"
      });
    };
  };

  return (
    <div className="employeeTaskDetail-wrapper">
      <header>
        <img src={backIcon} onClick={() => history.back()} />
        <h3>任务详情</h3>
      </header>
      <section className="employeeTaskDetail-content board-component ">
        <ul className="employeeTaskDetail-content-basicInfo">
          {
            Object.entries(taskBasicInfo)
              .filter(([key]) => !["task_id", "employee"].includes(key))
              .map(([key, value]) => {
                return (
                  <li key={key} className="employeeTaskDetail-content-item">
                    <span>{keyTransformer(key).name}: </span>
                    <span style={{ color: taskStatusColor(value as string) }}>
                      {["create_time", "deadline"].includes(key) ? new Date(Number(value)).toLocaleString() : value ? value : "暂无"}
                    </span>
                  </li>
                )
              })
          }
        </ul>
        <section className="employeeTaskDetail-content-fns">
            {taskBasicInfo.status === "待确认" && <button className="btn-blue" onClick={checkTask}>确认任务</button>}
            {taskBasicInfo.status !== "待确认" && taskBasicInfo.status !== "待审核" && <button className="btn-blue" onClick={handleTaskSubmit}>提交任务</button>}
            {taskBasicInfo.status === "待审核" && <button className="btn-gray">已提交</button>}
        </section>
      </section>
      <section className="employeeTaskDetail-content-taskTargets-wrapper">
        <h3>任务对象</h3>
        <ul className="employeeTaskDetail-content-taskTargets  board-component">
          <div className="employeeTaskDetail-content-headerRow">
            {
              taskTargetObjs.length > 0 &&
              Object.entries(taskTargetObjs[0])
                .filter(([key]) => !omitFields.includes(key))
                .map(([key]) => {
                  return (
                    <span className="employeeTaskDetail-content-header" key={key}>
                      {keyTransformer(key).name}
                    </span>
                  )
                })
            }
          </div>
          <div className="employeeTaskDetail-content-items-wrapper">
            {
              taskTargetObjs.map((taskTargetObj) => {
                return (
                  <li className="employeeTaskDetail-content-items" key={taskTargetObj.taskTargetObj_id} onClick={() => enterTaskTargetObjDetail(taskTargetObj)}>
                    {
                      Object.entries(taskTargetObj)
                        .filter(([key]) => !omitFields.includes(key))
                        .map(([key, value]) => {
                          return (
                            <li className="employeeTaskDetail-content-item" key={key}>
                              <span
                                style={{ color: taskBasicInfo.task_target === "班主任" ? teacherStatusColor(value as string) : studentStatusColor(value as string) }}
                              >
                                {["create_time", "deadline"].includes(key) ? new Date(Number(value)).toLocaleString() : value ? value : "暂无"}
                              </span>
                            </li>
                          )
                        })
                    }
                  </li>
                )
              })
            }
          </div>
        </ul>
      </section>
      {isTaskTargetDetailShow &&
        <TaskTargetDetail
          target={taskBasicInfo.task_target === "班主任" ? "teacher" : "student"}
          task_id={taskBasicInfo.task_id as string}
          data={currentTaskTargetobj}
          setIsTaskTargetDetailShow={setIsTaskTargetDetailShow} />}
    </div>
  )
}
import { useState, useEffect } from "react";
import makeRequest from "../../../../utils/makeRequest";
import { useLocation } from "react-router-dom";
import { usePrompt } from "../../../../components/prompts/PromptContext";

import keyTransformer from "../../../../utils/keyTransformer";
import handleStatusColor from "../../../../utils/handleStatusColor";

import useUrl from "../../../../store/urls";

import { TaskType } from "../../TaskCenter/TaskBoard/TaskBoard";
import { teacherDataType, studentDataType, taskTargetObjType } from "../../../../types/createDataModeltype";

import './EmployeeTaskDetail.css';

import backIcon from '../../../../static/common/back.png';

export default function employeeTaskDetail() {

  const location = useLocation();
  const { showPrompt, showCheck } = usePrompt();

  const backendUrl = useUrl(state => state.backendUrl);

  const [taskBasicInfo, setTaskBasicInfo] = useState<Partial<TaskType>>({});
  const [taskTargetObjs, setTaskTargetObjs] = useState<Partial<teacherDataType & studentDataType & taskTargetObjType>[]>([]);
  const [omitFields, setOmitFields] = useState<string[]>([
    "taskTargetObj_id", "task_id", "school_id", "teacher_id", "student_id", "create_time", "teacher_remark", "student_remark"
  ]);

  useEffect(() => {
    (async () => {
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
        console.log(res.data.data.taskTargetObjs);

      } else {
        showPrompt({
          content: res.error,
          type: 'error',
        });
      }
    })();

  }, []);

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

  const enterTaskTargetObjDetail = (taskTargetObj_id: string) => {
    if (taskBasicInfo.status === '待确认') {
      showPrompt({
        content: "请先确认任务内容",
        type: "error"
      });
    }
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
                    <span style={{ color: handleStatusColor(value as string) }}>
                      {["create_time", "deadline"].includes(key) ? new Date(Number(value)).toLocaleString() : value ? value : "暂无"}
                    </span>
                  </li>
                )
              })
          }
        </ul>
        <section className="employeeTaskDetail-content-fns">
          {
            taskBasicInfo.status === "待确认" ?
              <button className="btn-blue" onClick={checkTask}>确认任务</button>
              :
              <button className="btn-blue" onClick={checkTask}>提交任务</button>
          }
        </section>
      </section>
      <section className="employeeTaskDetail-content-taskTargets-wrapper">
        <h3>任务对象详情</h3>
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
                  <li className="employeeTaskDetail-content-items" key={taskTargetObj.taskTargetObj_id} onClick={() => enterTaskTargetObjDetail(taskTargetObj.taskTargetObj_id as string)}>
                    {
                      Object.entries(taskTargetObj)
                        .filter(([key]) => !omitFields.includes(key))
                        .map(([key, value]) => {
                          return (
                            <li className="employeeTaskDetail-content-item" key={key}>
                              <span style={{ color: handleStatusColor(value as string) }}>
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
    </div>
  )
}
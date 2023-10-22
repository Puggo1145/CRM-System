import { createPortal } from "react-dom";
import { useState, useRef } from "react";
import makeRequest from "../../../../../utils/makeRequest";
import PubSub from "pubsub-js";

import BackgroundMask from "../../../../../components/BackgroundMask/BackgroundMask";
import { usePrompt } from "../../../../../components/prompts/PromptContext";
import keyTransformer from "../../../../../utils/keyTransformer";
import formRenderer from "../../../../../utils/formRenderer";

import useUrl from "../../../../../store/urls";

import { teacherDataType, studentDataType, taskTargetObjType } from "../../../../../types/createDataModeltype";

import './TaskTargetDetail.css';

import closeIcon from '../../../../../static/common/close-icon.png';

export default function TaskTargetDetail(
    { target, task_id, data, setIsTaskTargetDetailShow }: { target: "teacher" | "student", task_id: string,  data: Partial<teacherDataType & studentDataType & taskTargetObjType>, setIsTaskTargetDetailShow: (isShow: boolean) => void }
) {

    const { showPrompt, showCheck } = usePrompt();
    const backendUrl = useUrl(state => state.backendUrl);

    const formRef = useRef<HTMLFormElement>(null);

    const [omitFields] = useState<string[]>([
        "taskTargetObj_id", "task_id", "school_id", "teacher_id", "student_id", "create_time"
    ]);

    const navigateBack = async() => {
        const result = await showCheck("所有修改的内容都会丢失，确定要返回吗?");
        if (!result) return;
        setIsTaskTargetDetailShow(false);
    };

    const handleSubmit = async() => {
        const form = new FormData(formRef.current!);
        const formData = Object.fromEntries(form.entries());

        if (formData["student_status"] === "对接中" || formData["teacher_status"] === "对接中") {
            return showPrompt({
                content: "请更新任务对象的状态",
                type: "error"
            })
        };

        const result = await showCheck("确认要提交吗");
        if (!result) return;

        const res = await makeRequest({
            method: "PATCH",
            url: `${backendUrl}/api/v1/tasks/${target}/${data.taskTargetObj_id}`,
            data: {
                task_id,
                target_id: target === "teacher" ? data.teacher_id : data.student_id,
                formData
            }
        });

        if (!('error' in res)) {
            showPrompt({
                content: "提交成功",
                type: "success"
            });
            setIsTaskTargetDetailShow(false);
        } else {
            showPrompt({
                content: `${res.error}`,
                type: "error"
            })
        };

        PubSub.publish("updateTaskTargetObjs");
    };

    return createPortal(
        <div className="taskTargetDetail-wrapper board-component">
            <header>
                <h3>任务对象详情</h3>
                <a onClick={navigateBack}><img src={closeIcon} /></a>
            </header>
            <section className="taskTargetDetail-content">
                <form ref={formRef}>
                    {
                        Object.entries(data)
                            .filter(([key]) => !omitFields.includes(key))
                            .map(([key, value]) => {
                                return (
                                    <div className="taskTargetDetail-content-item" key={key}>
                                        <span>{keyTransformer(key).name}</span>
                                        <span>
                                            {
                                                !["phone", "wechat", "name"].includes(key.split("_")[1]) ?
                                                    formRenderer({
                                                        formType: keyTransformer(key).formType,
                                                        defaultValue: value as string | number,
                                                        selectOptions: keyTransformer(key).selectOptions!,
                                                        keyName: key
                                                    })
                                                    :
                                                    value ? value : "暂无"
                                            }
                                        </span>
                                    </div>
                                )
                            })
                    }
                </form>
            </section>
            <section className="taskTargetDetail-fns">
                <button className="btn-blue" onClick={handleSubmit}>提交</button>
            </section>
            <BackgroundMask />
        </div>,
        document.body
    )
}
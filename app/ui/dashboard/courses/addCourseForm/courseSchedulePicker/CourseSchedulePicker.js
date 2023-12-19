"use client";

import React, { useState } from "react";

const CourseSchedulePicker = ({ info: aInfo }) => {
    const [isClassDaysShown, setIsClassDaysShown] = useState(false);

    const [info, setInfo] = useState(
        aInfo || {
            start: "",
            end: "",
            classDays: {
                monday: {},
                tuesday: {},
                wednesday: {},
                thursday: {},
                friday: {},
                saturday: {},
                sunday: {},
            },
        }
    );

    return (
        <div>
            <label htmlFor="start">Start Date</label>
            <input
                type="date"
                name="startDate"
                defaultValue={info.start}
                id="start"
            />

            <label htmlFor="end">End Date</label>
            <input
                type="date"
                name="endDate"
                id="end"
                defaultValue={info.end}
            />

            <button type="button" onClick={() => setIsClassDaysShown(true)}>
                add custom class days
            </button>

            {isClassDaysShown && (
                <div>
                    <div>
                        {Object.keys(info.classDays).map((day) => (
                            <div key={day}>
                                <span>{day}:</span>
                                <label htmlFor={day + "from"}>from</label>
                                <input
                                    defaultValue={
                                        info.classDays[day].from || ""
                                    }
                                    type="time"
                                    name={day}
                                    id={day + "from"}
                                />

                                <label htmlFor={day + "to"}>to</label>
                                <input
                                    type="time"
                                    name={day}
                                    id={day + "to"}
                                    defaultValue={info.classDays[day].to || ""}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseSchedulePicker;

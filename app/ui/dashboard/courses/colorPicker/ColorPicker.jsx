"use client";
import React, { useEffect, useState } from "react";
import Styles from "./colorPicker.module.css";

const ColorPicker = ({ textContent, defaultBG, defaultTextColor }) => {
    const [bg, setBg] = useState(defaultBG || "");
    const [textColor, setTextColor] = useState(defaultTextColor || "");

    return (
        <div style={{ marginTop: "2rem" }}>
            <label
                htmlFor="bg"
                style={{ marginBottom: ".5rem", display: "block" }}
            >
                Calendar Event
            </label>
            <span
                className={Styles.textContainer}
                style={{
                    backgroundColor: bg,
                    color: textColor,
                }}
            >
                {textContent}
            </span>

            <div className={Styles.container}>
                <div>
                    <label htmlFor="bg">Background color</label>
                    <input
                        id="bg"
                        name="background"
                        type="color"
                        value={bg}
                        onChange={(e) => setBg(e.target.value)}
                    ></input>
                </div>

                <div>
                    <label htmlFor="text">Text color</label>
                    <input
                        value={textColor}
                        name="textColor"
                        id="text"
                        type="color"
                        onChange={(e) => setTextColor(e.target.value)}
                    ></input>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;

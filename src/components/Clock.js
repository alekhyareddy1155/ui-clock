import React, { useEffect, useState, useRef } from "react";
import "./style.css";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [minutes, setMinutes] = useState(time.getMinutes());
  const [seconds, setSeconds] = useState(time.getSeconds());
  const [displayTime, setDisplayTime] = useState(`${minutes} : ${seconds}`);
  const [focused, setFocused] = useState(false);
  const [isDraggingSecondHand, setIsDraggingSecondHand] = useState(false);
  const [isDraggingMinuteHand, setIsDraggingMinuteHand] = useState(false);
  const clockRef = useRef(null);
  const centerX = 100; // X-coordinate of the clock center
  const centerY = 100; // Y-coordinate of the clock center

  useEffect(() => {
    let timerId;
    if (!isDraggingSecondHand && !isDraggingMinuteHand) {
      timerId = setInterval(() => {
        if (seconds === 59) {
          setSeconds(0);
          if (minutes === 59) {
            setMinutes(0);
          } else {
            setMinutes(minutes + 1);
          }
        } else {
          setSeconds(seconds + 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerId);
    };
  });
  useEffect(() => {
    if (focused) {
    } else {
      setDisplayTime(`${minutes} : ${seconds}`);
    }
  }, [minutes, seconds, focused]);

  const onChangeHandler = (event) => {
    if (event.target.value) {
      const splitStr = event.target.value.split(" : ");

      setDisplayTime(event.target.value);
      const inputMinutes = Number(splitStr[0]);

      if (inputMinutes < 60) {
        setMinutes(inputMinutes);
      } else {
        const overallMinutes = inputMinutes % 60;
        setMinutes(overallMinutes);
      }
      const inputSeconds = Number(splitStr[1]);
      if (inputSeconds < 60) {
        setSeconds(inputSeconds);
      } else {
        const overallSeconds = inputSeconds % 60;
        setSeconds(overallSeconds);
      }
    }
  };
  const onFocusHandler = () => {
    setFocused(true);
  };

  const onFocusOutHandler = () => {
    setFocused(false);
  };

  const handleSecondHandDragStart = () => {
    setIsDraggingSecondHand(true);
  };

  const handleMinuteHandDragStart = () => {
    setIsDraggingMinuteHand(true);
  };

  const handleMouseMove = (event) => {
    if (isDraggingSecondHand || isDraggingMinuteHand) {
      const clockRect = clockRef.current.getBoundingClientRect();
      const mouseX = event.clientX - clockRect.left - centerX;
      const mouseY = event.clientY - clockRect.top - centerY;

      const angle = Math.atan2(mouseY, mouseX);
      const degrees = (angle * 180) / Math.PI;
      const value = Math.floor((degrees + 90) / 6);

      if (isDraggingSecondHand) {
        if (value >= 0) {
          setSeconds(value);
        } else {
          setSeconds(value + 60);
        }
      } else if (isDraggingMinuteHand) {
        if (value >= 0) {
          setMinutes(value);
        } else {
          setMinutes(value + 60);
        }
      }
    }
  };
  const onClickHandler = () => {
    setIsDraggingSecondHand(false);
    setIsDraggingMinuteHand(false);
  };

  return (
    <div className="clock-container">
      <div
        className="clock"
        onMouseMove={handleMouseMove}
        onMouseUp={onClickHandler}
        ref={clockRef}
      >
        <div
          className="min_hand"
          style={{
            transform: `rotateZ(${minutes * 6}deg)`,
          }}
          onMouseDown={handleMinuteHandDragStart}
          onTouchStart={handleMinuteHandDragStart}
        />
        <div
          className="sec_hand"
          style={{
            transform: `rotateZ(${seconds * 6}deg)`,
          }}
          onMouseDown={handleSecondHandDragStart}
          onTouchStart={handleSecondHandDragStart}
        />
        <span className="twelve">12</span>
        <span className="one">1</span>
        <span className="two">2</span>
        <span className="three">3</span>
        <span className="four">4</span>
        <span className="five">5</span>
        <span className="six">6</span>
        <span className="seven">7</span>
        <span className="eight">8</span>
        <span className="nine">9</span>
        <span className="ten">10</span>
        <span className="eleven">11</span>
      </div>
      <input
        type="text"
        className="display-text"
        value={displayTime}
        onFocus={onFocusHandler}
        onChange={(e) => onChangeHandler(e)}
        onBlur={onFocusOutHandler}
      />
    </div>
  );
};

export default Clock;

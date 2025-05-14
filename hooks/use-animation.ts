"use client"

import { useState } from "react"

type AnimationState = "idle" | "entering" | "entered" | "exiting" | "exited"

interface UseAnimationOptions {
  initialState?: AnimationState
  enterDelay?: number
  exitDelay?: number
  onEnter?: () => void
  onEntered?: () => void
  onExit?: () => void
  onExited?: () => void
}

export function useAnimation({
  initialState = "idle",
  enterDelay = 0,
  exitDelay = 0,
  onEnter,
  onEntered,
  onExit,
  onExited,
}: UseAnimationOptions = {}) {
  const [state, setState] = useState<AnimationState>(initialState)

  const enter = () => {
    if (state === "entering" || state === "entered") return

    setState("entering")
    onEnter?.()

    if (enterDelay > 0) {
      setTimeout(() => {
        setState("entered")
        onEntered?.()
      }, enterDelay)
    } else {
      setState("entered")
      onEntered?.()
    }
  }

  const exit = () => {
    if (state === "exiting" || state === "exited") return

    setState("exiting")
    onExit?.()

    if (exitDelay > 0) {
      setTimeout(() => {
        setState("exited")
        onExited?.()
      }, exitDelay)
    } else {
      setState("exited")
      onExited?.()
    }
  }

  const toggle = () => {
    if (state === "entering" || state === "entered") {
      exit()
    } else {
      enter()
    }
  }

  return {
    state,
    enter,
    exit,
    toggle,
    isEntering: state === "entering",
    isEntered: state === "entered",
    isExiting: state === "exiting",
    isExited: state === "exited",
    isVisible: state === "entering" || state === "entered",
  }
}


import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Optimized reducer with fewer re-renders
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Dismiss all toasts if no id is provided
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map((t) => ({
            ...t,
            open: false,
          })),
        }
      }

      // Only dismiss the toast with the matching id
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action

      // Remove all toasts if no id is provided
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }

      // Only remove the toast with the matching id
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }
    }
  }
}

// Create a fast toast context with memoized values
const ToastContext = React.createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: { toasts: [] },
  dispatch: () => null,
})

// Performance-optimized Provider component with memoization 
function useToastReducer() {
  return React.useReducer(reducer, { toasts: [] })
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useToastReducer()
  const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch])

  return React.createElement(
    ToastContext.Provider,
    { value: contextValue },
    children
  )
}

export const useToast = () => {
  const { dispatch } = React.useContext(ToastContext)

  // Memoize toast function to prevent unnecessary rerenders
  return React.useMemo(
    () => ({
      toast: (props: Omit<ToasterToast, "id">) => {
        const id = genId()

        const update = (props: Partial<ToasterToast>) =>
          dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
          })

        const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

        dispatch({
          type: actionTypes.ADD_TOAST,
          toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open: boolean) => {
              if (!open) {
                dismiss()
              }
            },
          },
        })

        return {
          id,
          dismiss,
          update,
        }
      },
      dismiss: (toastId?: string) => {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
      },
    }),
    [dispatch]
  )
}

// Export a simple toast function for direct usage
export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast } = useToast()
  return toast(props)
}

export function useToaster() {
  const { state, dispatch } = React.useContext(ToastContext)

  React.useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.open === false && !toastTimeouts.has(toast.id)) {
        // Start cleanup timer when a toast is closed
        const timeoutId = setTimeout(() => {
          toastTimeouts.delete(toast.id)
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: toast.id })
        }, TOAST_REMOVE_DELAY)

        toastTimeouts.set(toast.id, timeoutId)
      }
    })
  }, [state.toasts, dispatch])

  return {
    toasts: state.toasts,
    // Manual dismiss function for programmatic control
    dismiss: (toastId?: string) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
    },
  }
}

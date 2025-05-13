
import * as React from "react"

// Set breakpoint to standard Tailwind sm breakpoint (640px)
const MOBILE_BREAKPOINT = 640

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(true)

  React.useEffect(() => {
    // Use min-width in a mobile-first approach (default to mobile)
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`)
    
    const onChange = () => {
      setIsMobile(!mql.matches) // If min-width query doesn't match, it's mobile
    }
    
    mql.addEventListener("change", onChange)
    setIsMobile(!mql.matches) // Set initial value (default to mobile)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

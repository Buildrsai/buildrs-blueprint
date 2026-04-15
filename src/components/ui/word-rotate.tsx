import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface WordRotateProps {
  words: string[]
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export function WordRotate({ words, duration = 2200, className, style }: WordRotateProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, duration)
    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <span
      className="inline-block overflow-hidden"
      style={{ verticalAlign: "bottom", paddingTop: "0.1em", paddingBottom: "0.15em", marginBottom: "-0.15em" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          className={cn(className)}
          initial={{ opacity: 0, y: "-60%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "60%" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ display: "inline-block", ...style }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

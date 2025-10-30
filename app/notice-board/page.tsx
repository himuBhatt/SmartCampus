"use client"

import { useState } from "react"
import NoticeBoard3D from "@/components/notice-board-3d"
import Background3D from "@/components/3d-background"

export default function NoticeBoardPage() {
  const [selected, setSelected] = useState<number | null>(null)

  // Notices include positioning for clickable regions on the board
  const notices = [
    { id: 1, title: "Exam Schedule", date: "2025-11-10", content: "Final exams start from Nov 10. Check department notice.", x: 80, y: 60, w: 160, h: 110, color: "#fffaf0" },
    { id: 2, title: "Holiday Notice", date: "2025-12-25", content: "College will be closed on Dec 25 for winter break.", x: 280, y: 40, w: 180, h: 120, color: "#f8fff0" },
    { id: 3, title: "Seminar on AI", date: "2025-11-20", content: "Guest lecture on AI & ML by industry experts.", x: 120, y: 220, w: 220, h: 130, color: "#fff8f2" },
  ]

  return (
    <main className="pt-20">
      <section className="py-12 px-4 bg-gradient-to-r from-color-primary to-color-primary-light text-white relative">
        <Background3D className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Notice Board</h1>
          <p className="text-lg opacity-90 max-w-3xl">Latest college notices and announcements. Click a notice to read details.</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-card-bg">
        <div className="max-w-7xl mx-auto">
          <NoticeBoard3D notices={notices} onNoticeClick={(id) => setSelected(id)} />
        </div>
      </section>

      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-2xl w-full rounded-lg p-6" onClick={(e) => e.stopPropagation()}>
            <button className="float-right text-neutral" onClick={() => setSelected(null)}>Close</button>
            <h3 className="text-2xl font-bold mb-2">{notices.find((x) => x.id === selected)?.title}</h3>
            <p className="text-sm text-neutral mb-4">{notices.find((x) => x.id === selected)?.date}</p>
            <p className="text-foreground">{notices.find((x) => x.id === selected)?.content}</p>
          </div>
        </div>
      )}
    </main>
  )
}

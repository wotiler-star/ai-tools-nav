"use client";

import { useEffect, useState } from "react";
import { VerticalAlignTopOutlined } from "@ant-design/icons";

/** 回到顶部：滚动超过 400px 出现，点击平滑回顶（品牌色圆钮，随主题变量） */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="回到顶部"
      className={`back-to-top${show ? "" : " hidden"}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <VerticalAlignTopOutlined style={{ fontSize: 18 }} />
    </button>
  );
}

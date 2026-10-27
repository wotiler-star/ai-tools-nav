import Link from "next/link";
import { SITE } from "@/config/site";
import { ToollyMark } from "@/components/Logo";

const LINKS = [
  { label: "关于本站", href: "/about" },
  { label: "商务合作", href: "mailto:bd@toolly.cc" },
  { label: "增值电信业务经营许可证", href: "https://beian.miit.gov.cn/", external: true }
];

const SOCIALS = ["公众号", "官方抖音", "知乎主页", "B站主页"];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-1200 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 品牌 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <ToollyMark size={32} />
              <span className="text-lg font-bold text-gray-900">
                {SITE.name}
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              {SITE.slogan}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              站长：<span className="text-gray-700">{SITE.owner}</span>
            </div>
          </div>

          {/* 相关链接 */}
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-900">
              相关链接
            </div>
            <ul className="m-0 list-none space-y-2 p-0">
              {LINKS.map((l) => (
                <li key={l.label}>
                  {l.external || l.href.startsWith("mailto:") ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-gray-500 hover:text-[#3874F7]"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-sm text-gray-500 hover:text-[#3874F7]"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 关注我们 + 小助手 */}
          <div>
            <div className="mb-3 text-sm font-semibold text-gray-900">
              关注我们
            </div>
            <div className="flex items-start gap-4">
              <div className="text-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-lg text-3xl"
                  style={{ background: "#f3f4f6" }}
                >
                  📱
                </div>
                <div className="mt-1 text-xs text-gray-400">联系小助手</div>
              </div>
              <ul className="m-0 list-none space-y-2 p-0">
                {SOCIALS.map((s) => (
                  <li
                    key={s}
                    className="cursor-pointer text-sm text-gray-500 hover:text-[#3874F7]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-5 text-center text-xs text-gray-400">
          © {year} {SITE.name}
          {SITE.icp ? (
            <>
              {" · "}
              <a
                href="https://beian.miit.gov.cn"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#3874F7]"
              >
                {SITE.icp}
              </a>
            </>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

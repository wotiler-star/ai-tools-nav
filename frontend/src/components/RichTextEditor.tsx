"use client";

import { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Node,
  Transforms,
  BaseEditor,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
} from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";

type CustomElement = {
  type: "paragraph" | "heading-two" | "bulleted-list" | "list-item";
  children: CustomText[];
};
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

function getPlainText(nodes: Descendant[]): string {
  return nodes.map((n) => Node.string(n)).join("\n").trim();
}

export default function RichTextEditor({
  onChange,
  placeholder = "写点什么…支持 **加粗**、*斜体*、标题与列表",
}: {
  onChange?: (nodes: Descendant[], plainText: string) => void;
  placeholder?: string;
}) {
  const editor = useMemo(
    () => withHistory(withReact(createEditor())),
    []
  );

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading-two":
        return (
          <h2 {...props.attributes} style={{ fontSize: 20, fontWeight: 700, margin: "12px 0 8px" }}>
            {props.children}
          </h2>
        );
      case "bulleted-list":
        return (
          <ul {...props.attributes} style={{ paddingLeft: 20, margin: "8px 0" }}>
            {props.children}
          </ul>
        );
      case "list-item":
        return <li {...props.attributes}>{props.children}</li>;
      default:
        return (
          <p {...props.attributes} style={{ margin: "8px 0" }}>
            {props.children}
          </p>
        );
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let children = props.children;
    if (props.leaf.bold) children = <strong>{children}</strong>;
    if (props.leaf.italic) children = <em>{children}</em>;
    if (props.leaf.code)
      children = (
        <code style={{ background: "#f2f3f5", padding: "1px 5px", borderRadius: 4, fontFamily: "monospace" }}>
          {children}
        </code>
      );
    return <span {...props.attributes}>{children}</span>;
  }, []);

  const handleChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(
      (op) => op.type !== "set_selection"
    );
    if (isAstChange) onChange?.(value, getPlainText(value));
  };

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <div style={{ border: "1px solid var(--border, #eaecef)", borderRadius: 10, overflow: "hidden" }}>
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
          style={{
            padding: 14,
            minHeight: 180,
            maxHeight: 360,
            overflow: "auto",
            fontSize: 15,
            lineHeight: 1.8,
          }}
        />
      </div>
    </Slate>
  );
}

function Toolbar() {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: "8px 10px",
        borderBottom: "1px solid var(--border, #eaecef)",
        background: "var(--surface-2, #fafbfc)",
      }}
    >
      <MarkButton format="bold" label="B" title="加粗" />
      <MarkButton format="italic" label="I" title="斜体" />
      <MarkButton format="code" label="</>" title="代码" />
      <BlockButton format="heading-two" label="H2" title="标题" />
      <BlockButton format="bulleted-list" label="• 列表" title="无序列表" />
    </div>
  );
}

function MarkButton({
  format,
  label,
  title,
}: {
  format: "bold" | "italic" | "code";
  label: string;
  title: string;
}) {
  const editor = useSlate();
  const active = isMarkActive(editor, format);
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      style={btnStyle(active)}
    >
      {label}
    </button>
  );
}

function BlockButton({
  format,
  label,
  title,
}: {
  format: "heading-two" | "bulleted-list";
  label: string;
  title: string;
}) {
  const editor = useSlate();
  const active = isBlockActive(editor, format);
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      style={btnStyle(active)}
    >
      {label}
    </button>
  );
}

function btnStyle(active: boolean): React.CSSProperties {
  return {
    minWidth: 30,
    height: 28,
    padding: "0 8px",
    borderRadius: 6,
    border: `1px solid ${active ? "#3874f7" : "#eaecef"}`,
    background: active ? "rgba(56,116,247,.1)" : "#fff",
    color: active ? "#3874f7" : "#4e5969",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  };
}

function isMarkActive(editor: Editor, format: "bold" | "italic" | "code") {
  const marks = Editor.marks(editor);
  return marks ? (marks as Record<string, unknown>)[format] === true : false;
}

function toggleMark(editor: Editor, format: "bold" | "italic" | "code") {
  const isActive = isMarkActive(editor, format);
  if (isActive) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}

function isBlockActive(editor: Editor, format: CustomElement["type"]) {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement).type === format,
    })
  );
  return !!match;
}

function toggleBlock(editor: Editor, format: "heading-two" | "bulleted-list") {
  const isActive = isBlockActive(editor, format);
  const isList = format === "bulleted-list";
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      (n as CustomElement).type === "bulleted-list",
    split: true,
  });
  const newType: CustomElement["type"] = isActive
    ? "paragraph"
    : isList
      ? "list-item"
      : format;
  Transforms.setNodes(editor, { type: newType } as Partial<CustomElement>);
  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: "bulleted-list",
      children: [],
    } as CustomElement);
  }
}

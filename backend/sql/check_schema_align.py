#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""校验 migration_missing_tables.sql 的列与 Java 实体字段是否完全对齐。

用法：python backend/sql/check_schema_align.py
退出码：0 全部对齐；1 存在差异
"""
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # backend/
ENTITY_DIR = ROOT / "ai-nav-web/src/main/java/com/ainav/model/entity"
SQL_FILE = ROOT / "sql/migrations/migration_missing_tables.sql"

# 实体类 -> 表名
TARGETS = {
    "AiColumnCategory.java": "ai_column_category",
    "AiColumn.java": "ai_column",
    "AiArticle.java": "ai_article",
    "AiComment.java": "ai_comment",
    "AiMessage.java": "ai_message",
}

# 需要同时校验的 SQL 文件（相对 backend/sql）
SQL_FILES = ["schema.sql", "migrations/migration_missing_tables.sql"]

# 实体中不参与建表的非列成员（Lombok/序列化等）
SKIP_FIELDS = {"serialVersionUID"}


def camel_to_snake(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def entity_columns(entity_file: Path):
    """返回 set(列名)"""
    src = entity_file.read_text(encoding="utf-8")
    # 只看类体，忽略 import/注解包路径
    body = src.split("public class", 1)[-1]
    cols = set()
    # 形如：@TableField("column_id")  private Long columnId;
    # 或：  private String title;
    pattern = re.compile(
        r'@TableField\(\s*"(?P<tf>[A-Za-z0-9_]+)"\s*\)?[\s\S]{0,200}?'
        r'private\s+[\w<>\[\],\s\.]+?\s+(?P<f>[A-Za-z0-9_]+)\s*;'
        r'|private\s+[\w<>\[\],\s\.]+?\s+(?P<f2>[A-Za-z0-9_]+)\s*;'
    )
    for m in pattern.finditer(body):
        explicit = m.group("tf")
        field = m.group("f") or m.group("f2")
        if not field or field in SKIP_FIELDS:
            continue
        cols.add(explicit if explicit else camel_to_snake(field))
    return cols


def sql_columns(sql_file: Path, table: str):
    """提取指定表的列名（去掉注释与 KEY 行）"""
    src = sql_file.read_text(encoding="utf-8")
    m = re.search(
        r"CREATE TABLE IF NOT EXISTS\s+`?%s`?\s*\((.*?)\n\)\s*ENGINE" % table,
        src,
        re.S,
    )
    if not m:
        return None
    block = m.group(1)
    cols = set()
    for line in block.splitlines():
        line = line.split("--")[0].strip()
        if not line or re.match(r"(KEY|PRIMARY KEY|UNIQUE|CONSTRAINT|INDEX)", line, re.I):
            continue
        fm = re.match(r"`?([A-Za-z0-9_]+)`?\s+\w+", line)
        if fm:
            cols.add(fm.group(1))
    return cols


def main() -> int:
    ok = True
    for entity_name, table in TARGETS.items():
        ef = ENTITY_DIR / entity_name
        if not ef.exists():
            print(f"[缺失] 实体文件不存在: {ef}")
            ok = False
            continue
        e_cols = entity_columns(ef)

        for rel in SQL_FILES:
            sql_file = ROOT / "sql" / rel
            if not sql_file.exists():
                print(f"[缺失] SQL 文件不存在: {rel}")
                ok = False
                continue
            s_cols = sql_columns(sql_file, table)
            # 迁移脚本只管 4 张知识库表，缺 ai_message 属预期
            expected = (
                rel != "migrations/migration_missing_tables.sql"
                or table != "ai_message"
            )
            if s_cols is None:
                if expected:
                    print(f"[缺失] {rel} 中未找到建表语句: {table}")
                    ok = False
                else:
                    print(f"[跳过] {rel} 不含 {table}（预期）")
                continue
            missing = sorted(e_cols - s_cols)   # 实体有、SQL 没有 -> 严重
            extra = sorted(s_cols - e_cols)     # SQL 有、实体没有 -> 提示
            if missing or extra:
                ok = False
                print(f"[不一致] {rel} :: {table}")
                if missing:
                    print(f"    实体有但 SQL 缺: {missing}")
                if extra:
                    print(f"    SQL 有但实体无: {extra}")
            else:
                print(f"[对齐] {os.path.basename(rel)} :: {table}  ({len(s_cols)} 列)")
    print("\n结果：" + ("全部对齐 ✅" if ok else "存在差异 ❌"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

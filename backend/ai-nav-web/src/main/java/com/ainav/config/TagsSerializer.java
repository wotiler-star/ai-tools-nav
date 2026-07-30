package com.ainav.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

/**
 * 把数据库里逗号分隔的 tags 字符串序列化为 JSON 数组，
 * 与前端 AiTool.tags: string[] 对齐（不影响 MyBatis 的 DB 存取）。
 */
public class TagsSerializer extends StdSerializer<String> {

    public TagsSerializer() {
        super(String.class);
    }

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartArray();
        if (value != null && !value.isEmpty()) {
            for (String s : value.split(",")) {
                gen.writeString(s.trim());
            }
        }
        gen.writeEndArray();
    }
}

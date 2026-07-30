package com.ainav.config;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.List;

/**
 * 把前端传来的 tags 数组反序列化为逗号分隔字符串再存库；
 * 兼容直接传字符串的情况（容错）。
 */
public class TagsDeserializer extends StdDeserializer<String> {

    public TagsDeserializer() {
        super(String.class);
    }

    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        if (p.getCurrentToken() == JsonToken.START_ARRAY) {
            List<String> list = p.readValueAs(new TypeReference<List<String>>() {
            });
            if (list == null) {
                return "";
            }
            StringBuilder sb = new StringBuilder();
            for (String s : list) {
                if (s == null) {
                    continue;
                }
                if (sb.length() > 0) {
                    sb.append(",");
                }
                sb.append(s.trim());
            }
            return sb.toString();
        }
        String s = p.getValueAsString();
        return s == null ? "" : s;
    }
}

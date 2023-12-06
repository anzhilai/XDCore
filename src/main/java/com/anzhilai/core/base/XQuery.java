package com.anzhilai.core.base;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * XQuery 注解用于定义查询类型的属性，包括表名、列名、查询类型和默认值。
 * 查询类型支持多种操作符，如like、equal、great等，以及自定义操作。
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface XQuery {
    /**
     * 查询类型枚举，定义了支持的查询操作符。
     */
    enum QueryType {

        like, notLike, rightlike, leftlike, equal,range, noEqual, greatEqual, lessEqual, great, less, user, in, notIn, none, isnullORnot, equalOrNull, custom;

        public static String GetOperate(QueryType t) {
            String oper = "";
            if (t == QueryType.like || t == QueryType.rightlike || t == QueryType.leftlike) {
                oper = "like";
            } else if (t == QueryType.notLike) {
                oper = "not like";
            } else if (t == QueryType.equal || t == QueryType.user) {
                oper = "=";
            } else if (t == QueryType.noEqual) {
                oper = "<>";
            } else if (t == QueryType.greatEqual) {
                oper = ">=";
            } else if (t == QueryType.lessEqual) {
                oper = "<=";
            } else if (t == QueryType.great) {
                oper = ">";
            } else if (t == QueryType.less) {
                oper = "<";
            } else if (t == QueryType.in) {
                oper = "in";
            } else if (t == QueryType.notIn) {
                oper = "not in";
            }
            return oper;
        }
    }
    /**
     * 获取查询所针对的表名。
     * @return 表名。
     */
    String table() default "";
    /**
     * 获取查询所针对的列名。
     * @return 列名。
     */
    String column() default "";
    /**
     * 获取查询的类型，默认值为 like。
     * @return 查询类型。
     */
    QueryType type() default QueryType.like;
    /**
     * 获取查询的默认值。
     * @return 默认值。
     */
    String Default() default "";


}

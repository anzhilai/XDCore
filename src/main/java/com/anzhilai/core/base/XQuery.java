package com.anzhilai.core.base;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

//
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface XQuery {
    public enum QueryType {

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

    String table() default "";

    String column() default "";

    QueryType type() default QueryType.like;

    String Default() default "";


}

package com.anzhilai.core.toolkit;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Created by  on 2017-04-26.
 */
public class RequestUtil {

    public static boolean HasRequest() {
        if (GetRequest() != null) return true;
        return false;
    }

    public static HttpServletRequest GetRequest() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (servletRequestAttributes == null) return null;
        HttpServletRequest request = servletRequestAttributes.getRequest();
        return request;
    }

    public static HttpServletResponse GetResponse() {
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (servletRequestAttributes == null) return null;
        HttpServletResponse response = servletRequestAttributes.getResponse();
        return response;
    }

    public static HttpSession GetSession() {
        HttpSession session = GetRequest().getSession();
        return session;
    }

    public static String GetRequestHost() {
        return GetRequestHost(GetRequest());
    }

    public static String GetRequestHost(HttpServletRequest request) {
        return request.getHeader("Host");
    }

    //获取客户端Ip
    public static String GetClientIpAddress() {
        return GetClientIpAddress(GetRequest());
    }

    public static String GetClientIpAddress(HttpServletRequest request) {
        if (request == null) {
            return "localhost";
        }
        String ipAddress = request.getHeader("X-Real-IP");
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("x-forwarded-for");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.length() == 0 || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
            if (ipAddress.equals("127.0.0.1") || ipAddress.equals("0:0:0:0:0:0:0:1")) {
                // 根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ipAddress = inet.getHostAddress();
            }
        }
        // 对于通过多个代理的情况，第一个IP为客户端真实IP,多个IP按照','分割
        if (ipAddress != null && ipAddress.length() > 15) { // "***.***.***.***".length()
            // = 15
            if (ipAddress.indexOf(",") > 0) {
                ipAddress = ipAddress.substring(0, ipAddress.indexOf(","));
            }
        }
        return ipAddress;
    }

    public static String GetUrlAndQuery() {
        if (HasRequest()) {
            HttpServletRequest request = GetRequest();
            String qs = request.getQueryString();
            return request.getRequestURL() + (StrUtil.isEmpty(qs) ? "" : "?" + qs);
        }
        return "";
    }

    public static Object SetParameter(HttpServletRequest request, String field, Object value) {
        request.setAttribute(field, value);
        return value;
    }


    public static Date GetDate(HttpServletRequest request, String field) {
        return TypeConvert.ToDate(GetParameter(request, field));
    }

    public static String GetString(HttpServletRequest request, String field) {
        return TypeConvert.ToString(GetParameter(request, field));
    }

    public static String[] GetStringArray(HttpServletRequest request, String field) {
        if (request == null) {
            return new String[]{};
        }
        String[] values= request.getParameterValues(field);
        if(values==null){
            values= new String[]{};
        }
        return values;
    }

    public static String GetParameter(HttpServletRequest request, String field) {
        if (request == null) {
            return null;
        }
        // 为空格的时候表示清空原有参数
        String value = TypeConvert.ToString(request.getAttribute(field));
        if (StrUtil.isNotEmpty(value)) {
            return value;
        }
        return request.getParameter(field);
    }

    public static String GetParameter(String field) {
        HttpServletRequest request = RequestUtil.GetRequest();
        return GetParameter(request, field);
    }

    public static <T> T GetParameter(Class<T> type, HttpServletRequest request, String field) {
        return TypeConvert.ToTypeValue(type, GetParameter(request, field));
    }

    public static Boolean GetBooleanParameter(String field) {
        return TypeConvert.ToBoolean(GetParameter(field));
    }

    public static Boolean GetBooleanParameter(HttpServletRequest request, String field) {
        return TypeConvert.ToBoolean(GetParameter(request, field));
    }

    public static Long GetLongParameter(String field) {
        return TypeConvert.ToLong(GetParameter(field));
    }

    public static Long GetLongParameter(HttpServletRequest request, String field) {
        return TypeConvert.ToLong(GetParameter(request, field));
    }

    public static Integer GetIntParameter(HttpServletRequest request, String field) {
        return TypeConvert.ToInteger(GetParameter(request, field));
    }

    public static Double GetDoubleParameter(String field) {
        return TypeConvert.ToDouble(GetParameter(field));
    }

    public static Double GetDoubleParameter(HttpServletRequest request, String field) {
        return TypeConvert.ToDouble(GetParameter(request, field));
    }

    public static Map<String, Object> getParamsMap(HttpServletRequest request) {
        Map<String, Object> returnMap = new HashMap<>();
        Iterator<Map.Entry<String, String[]>> entries = request.getParameterMap().entrySet().iterator();
        Map.Entry entry;
        String name;
        Object valueObj;
        while (entries.hasNext()) {
            entry = entries.next();
            name = (String) entry.getKey();
            valueObj = entry.getValue();
            if (valueObj != null && valueObj instanceof String[]) {
                String[] values = (String[]) valueObj;
                if (values.length == 1) {
                    returnMap.put(name, values[0]);
                } else {
                    returnMap.put(name, valueObj);
                }
            } else {
                returnMap.put(name, valueObj);
            }
        }
        return returnMap;
    }

    public static String GetPostBody(HttpServletRequest request) throws Exception {
        InputStream is = request.getInputStream();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        byte[] bs = new byte[2048];
        int length;
        while ((length = is.read(bs)) != -1) {
            os.write(bs, 0, length);
        }
        byte[] out = os.toByteArray();

        String str = new String(out);
        return str;
    }

    public static String GetPostBody2(HttpServletRequest request) throws Exception {
        BufferedReader br = request.getReader();
        String str, body = "";
        while ((str = br.readLine()) != null) {
            body += str;
        }
        return body;
    }
}

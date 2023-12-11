package com.anzhilai.core.framework;

import com.anzhilai.core.base.XInterceptor;
import com.anzhilai.core.database.DBSession;
import org.springframework.stereotype.Repository;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 系统拦截器,拦截一切http请求
 */
@Repository
@XInterceptor(priority = 0)
public class XInterceptorHandler extends HandlerInterceptorAdapter {

    /**
     * 处理请求之前拦截，开启会话和设置参数
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        GlobalValues.baseAppliction.SessionStart();

        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        // 允许跨域
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.setContentType("text/html;charset=UTF-8");
        return super.preHandle(request, response, handler);
    }


    /**
     * 返回结果之前拦截，关闭会话，记录日志
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        GlobalValues.baseAppliction.SessionEnd();
        super.afterCompletion(request, response, handler, ex);
    }
}

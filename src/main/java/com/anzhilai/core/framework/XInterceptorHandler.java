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


    //处理请求之前拦截(可以在这做访问过快的拦截,也可以在这里做是否需要登录的拦截)
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        try {
            DBSession.getSession().beginTransaction();
        } catch (Throwable e) {
            e.printStackTrace();
            throw new XException("系统正忙，请稍后再试！");
        }

        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        // 允许跨域
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.setContentType("text/html;charset=UTF-8");
        return super.preHandle(request, response, handler);
    }


    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        super.postHandle(request, response, handler, modelAndView);
    }

    //返回结果之前拦截(一般用于纪录日志等等)
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        DBSession.getSession().commitTransaction();
        super.afterCompletion(request, response, handler, ex);
    }
}

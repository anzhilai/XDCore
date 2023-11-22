package com.anzhilai.core.framework;

import com.anzhilai.core.base.XException;
import com.anzhilai.core.database.AjaxResult;
import org.apache.log4j.Logger;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * 系统统一异常处理,拦截一切错误
 */
@ControllerAdvice
public class SystemExceptionHandler {
    private static Logger log = Logger.getLogger(SystemExceptionHandler.class);

    @ExceptionHandler(value = Exception.class)
    public ModelAndView resolveException(HttpServletRequest request, HttpServletResponse response, Exception ex) {
        try {
            if (ex instanceof XException) {
                log.error(ex.getMessage());
            }else if (ex instanceof CannotCreateTransactionException){
                ex = new XException("系统正忙，请稍后再试！");
                log.error(ex.getMessage());
            } else {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                ex.printStackTrace(pw);
                String msg = sw.toString();
                log.error("全局捕获异常" + ex.getMessage(), ex);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        SystemSessionManager.getSession().rollbackTransaction();
        //post的情况
        AjaxResult ar = AjaxResult.Exception(ex);
        try {
            response.setHeader("Access-Control-Allow-Origin", "*");//允许跨域
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write(ar.ToJson());
        } catch (IOException e) {
//            e.printStackTrace();
        }
        return null;
    }
}

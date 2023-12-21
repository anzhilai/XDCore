package com.anzhilai.core.framework;

import com.anzhilai.core.database.AjaxResult;
import com.anzhilai.core.database.DBSession;
import com.anzhilai.core.toolkit.TypeConvert;
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
 * 统一异常处理类
 * 拦截处理所有异常信息，同时回滚会话，特别是XException异常
 */
@ControllerAdvice
public class XExceptionHandler {
    private static Logger log = Logger.getLogger(XExceptionHandler.class);
    /**
     * 异常处理，返回错误信息并且回滚数据库会话操作
     */
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
        GlobalValues.baseAppliction.SessionRollBack();
        //post的情况
        AjaxResult ar = AjaxResult.False(ex.getMessage());
        try {
            response.setHeader("Access-Control-Allow-Origin", TypeConvert.ToString(request.getHeader("origin")));
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setContentType("text/html;charset=UTF-8");
            response.getWriter().write(ar.ToJson());
        } catch (IOException e) {
//            e.printStackTrace();
        }
        return null;
    }
}

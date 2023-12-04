package com.anzhilai.core.base;

import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.toolkit.TypeConvert;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;


public abstract class BaseStatisticController<T extends BaseStatistic> extends BaseController {
    public static Logger log = Logger.getLogger(BaseStatisticController.class);

    /**
     * 快速获取泛型的类型的方法
     *
     * @param objectClass 要取泛型的对应的Class
     * @param i           要取第几个泛型(0开始)
     * @param <T>
     * @return 对应的泛型
     */
    public static <T> Class<T> GetGenericClass(Class<? extends Object> objectClass, int i) {
        ParameterizedType type = (ParameterizedType) objectClass.getGenericSuperclass();
        if (type == null) {
            return null;
        }
        Type[] types = type.getActualTypeArguments();
        return (Class<T>) types[i];
    }

    public Class<T> GetClass() {
        return GetGenericClass(this.getClass(), 0);
    }

    @XController(name = "查询名称", input = "", output = "当前模型的名称")
    @RequestMapping(value = "/statlist", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statlist(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = TypeConvert.CreateNewInstance(GetClass());
        DataTable dt = model.run(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }
}

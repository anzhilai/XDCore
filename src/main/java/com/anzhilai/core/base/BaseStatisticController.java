package com.anzhilai.core.base;

import com.anzhilai.core.database.DataTable;
import com.anzhilai.core.toolkit.RequestUtil;
import com.anzhilai.core.toolkit.TypeConvert;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Map;

@Api(tags="数据统计模型的服务基类，提供了统计结果和统计明细查询等服务接口")
public abstract class BaseStatisticController<T extends BaseStatistic> extends BaseController {
    public static Logger log = Logger.getLogger(BaseStatisticController.class);

    /**
     * 快速获取泛型的类型的方法
     *
     * @param objectClass 要取泛型的对应的Class
     * @param i           要取第几个泛型(0开始)
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


    @ApiOperation(value = "统计列表", notes = "对特定列进行GroupBy，统计结果列表")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "filter", value = "统计数据的过滤条件", required = true, dataType = "QueryFilter", paramType = "body")
    })
    @XController
    @RequestMapping(value = "/statList", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statList(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = TypeConvert.CreateNewInstance(this.GetClass());
        String rowJson = RequestUtil.GetString(request,BaseStatistic.F_DimRowJson);
        model.ListRowDimension = TypeConvert.fromJsonList(rowJson,BaseStatistic.StatDimension.class);

        String colJson = RequestUtil.GetString(request,BaseStatistic.F_DimColumnJson);
        model.ListColumnDimension = TypeConvert.fromJsonList(colJson,BaseStatistic.StatDimension.class);

        String indiJson = RequestUtil.GetString(request,BaseStatistic.F_IndicatorJson);
        model.ListIndicator = TypeConvert.fromJsonList(indiJson,BaseStatistic.StatIndicator.class);
        DataTable dt = model.GetResultList(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }

    @XController
    @RequestMapping(value = "/statTreeList", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statTreeList(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = TypeConvert.CreateNewInstance(this.GetClass());
        String indiJson = RequestUtil.GetString(request,BaseStatistic.F_IndicatorJson);
        model.ListIndicator = TypeConvert.fromJsonList(indiJson,BaseStatistic.StatIndicator.class);

        String rowJson = RequestUtil.GetString(request,BaseStatistic.F_DimRowJson);
        model.ListRowDimension = TypeConvert.fromJsonList(rowJson,BaseStatistic.StatDimension.class);

        String colJson = RequestUtil.GetString(request,BaseStatistic.F_DimColumnJson);
        model.ListColumnDimension = TypeConvert.fromJsonList(colJson,BaseStatistic.StatDimension.class);
        DataTable dt = model.GetResultTreeList(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }

    @XController
    @RequestMapping(value = "/statValues", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String statValues(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = TypeConvert.CreateNewInstance(this.GetClass());
        String colJson = RequestUtil.GetString(request,BaseStatistic.F_DimColumnJson);
        model.ListColumnDimension = TypeConvert.fromJsonList(colJson,BaseStatistic.StatDimension.class);

        String indiJson = RequestUtil.GetString(request,BaseStatistic.F_IndicatorJson);
        model.ListIndicator = TypeConvert.fromJsonList(indiJson,BaseStatistic.StatIndicator.class);
        DataTable dt = model.GetResultValues(model.CreateQueryModel().InitFromRequest(request));
        return dt.ToJson();
    }


    @XController
    @RequestMapping(value = "/detailList", method = RequestMethod.POST, produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String detailList(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {
        T model = TypeConvert.CreateNewInstance(this.GetClass());
        String json = RequestUtil.GetString(request,BaseStatistic.F_StatResultValue);
        BaseStatistic.StatResultValue value = TypeConvert.FromJson(json,BaseStatistic.StatResultValue.class);
        DataTable dt = model.GetResultDetailList(model.CreateQueryModel().InitFromRequest(request),value);
        return dt.ToJson();
    }

}

package com.anzhilai.core.framework;

import com.alibaba.druid.pool.DruidPooledConnection;
import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.database.BaseDataSource;
import com.anzhilai.core.database.MySQLDataSource;
import com.anzhilai.core.database.SqlTable;
import com.anzhilai.core.database.sqlite.SQLiteDialect;
import com.anzhilai.core.database.sqlite.SqliteDataSource;
import com.anzhilai.core.toolkit.LogUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.jdbc.Work;

import javax.persistence.EntityManagerFactory;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


public class SystemSessionManager {
    public static Map<Long, BaseDataSource> threadDataSourceMap = new ConcurrentHashMap<>();//线程安全
    public static Map<Long, Boolean> threadMap = new ConcurrentHashMap<>();//线程安全
    public static BaseDataSource defaultDataSource;//默认数据源
    private Session session = null;
    private BaseDataSource dataSource = null;

    public static void OpenMysqlDataSource(String url, String username, String password) {
        SystemSessionManager.setThreadDataSource(new MySQLDataSource().init(url, username, password));
    }

//    public static void OpenSqliteDataSource(String path) {
//        SystemSessionManager.setThreadDataSource(new SqliteDataSource().init(path));
//    }

    public static void OpenDataSource(BaseDataSource dataSource) {
        SystemSessionManager.setThreadDataSource(dataSource);
    }

    public static void IsSelfConnection(boolean isSelf) {
        threadMap.put(Thread.currentThread().getId(), isSelf);
    }

    public static void CloseSelfDataSource() {
        BaseDataSource dataSource = SystemSessionManager.getUseThreadDataSource();
        if (dataSource != null) {
            dataSource.closeDataSource();
            SystemSessionManager.removeThreadDataSource();
        }
    }

    public static void setThreadDataSource(BaseDataSource dataSource) {
        threadDataSourceMap.put(Thread.currentThread().getId(), dataSource);
    }

    public static void removeThreadDataSource() {
        threadMap.remove(Thread.currentThread().getId());
        threadDataSourceMap.remove(Thread.currentThread().getId());
    }

    public static BaseDataSource getUseThreadDataSource() {
        return threadDataSourceMap.get(Thread.currentThread().getId());
    }

    public static BaseDataSource getThreadDataSource() {
        BaseDataSource dataSource = threadDataSourceMap.get(Thread.currentThread().getId());
        if (dataSource != null) {
            Boolean ret = threadMap.get(Thread.currentThread().getId());
            if (ret != null && ret == true) {
                return dataSource;
            }
        } else {
            if (SqlTable.defalutDialect != null && SQLiteDialect.class.isAssignableFrom(SqlTable.defalutDialect.getClass())) {
                return SqliteDataSource.GetMainSqliteDataSource();
            }
        }
        return defaultDataSource;
    }

    public SystemSessionManager(Session session) {
        this.session = session;
    }

    public SystemSessionManager(BaseDataSource dataSource) {
        this.dataSource = dataSource;
    }

    public synchronized static SystemSessionManager getSession() {
        BaseDataSource dataSource = getThreadDataSource();
        if (dataSource != null) {
            return new SystemSessionManager(dataSource);
        }

        SystemSessionManager sessionManager = null;
        SessionFactory sessionFactory = getSessionFactory();
        try {
            Session session = sessionFactory.getCurrentSession();
            sessionManager = new SystemSessionManager(session);// 不需要手动关闭
        } catch (Exception e) {
            LogUtil.i("获取自动会话失败!");
            e.printStackTrace();
            //Session session = sessionFactory.openSession();
            //sessionManager = new SystemSessionManager(true, session);// 需要手动关闭
        }
        return sessionManager;
    }

    private static SessionFactory sessionFactory;

    public synchronized static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            //EntityManagerFactory entityManagerFactory = SystemSpringConfig.getBean("entityManagerFactoryPrimary");
            EntityManagerFactory entityManagerFactory = SystemSpringConfig.getBean("entityManagerFactory");
            if (entityManagerFactory.unwrap(SessionFactory.class) == null) {
                throw new NullPointerException("factory is not a hibernate factory");
            }
            sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
        }
        return sessionFactory;
    }

    public static void setErrorMessageEncoding(Connection conn) {
        if (GlobalValues.isDebug && conn != null) {
            try {
                if (conn.getClass().isAssignableFrom(DruidPooledConnection.class)) {
                    DruidPooledConnection _conn = (DruidPooledConnection) conn;
                    Connection connection = _conn.getConnection();
                    Field field = connection.getClass().getDeclaredField("connection");
                    field.setAccessible(true);
                    Object obj = field.get(connection);
                    field = obj.getClass().getSuperclass().getDeclaredField("errorMessageEncoding");
                    field.setAccessible(true);
                    field.set(obj, "UTF-8");
                }
            } catch (Exception e) {
            }
        }
    }

    //重新扫描包名
    public static void ReScanPackages() {
        BaseDataSource dataSource = getThreadDataSource();
        if (dataSource != null) {
            dataSource.ScanPackages();
            return;
        }
        for (Class<?> aClass : GlobalValues.baseAppliction.GetScanClasses()) {
            if (BaseModel.class.isAssignableFrom(aClass)) {
                SqlTable.CheckTable((Class<BaseModel>) aClass);
            }
        }
    }

    public void doWork(boolean isUpdate, Work work) throws SQLException {
        BaseDataSource dataSource = getThreadDataSource();
        if (dataSource != null) {
            try {
                dataSource.doWork(work);
            } catch (Exception e) {
                throw e;
            }
            return;
        }
        boolean active = this.session.getTransaction().isActive();
        if (!active) {
            this.beginTransaction();
        }
        //临时的手动事务 end
        try {
            this.session.doWork(connection -> {
                try {
                    setErrorMessageEncoding(connection);
                    work.execute(connection);
                } catch (Exception e) {
                    throw e;
                }
            });
            //TODO 临时的手动事务 start
            if (!active) {
                this.commitTransaction();
            }
        } catch (Exception e) {
            if (!active) {
                this.rollbackTransaction();
            } else {
                throw e;
            }
            //临时的手动事务 end
        }
    }

    public Transaction beginTransaction() {
        if (this.dataSource != null) {
            try {
                this.dataSource.beginTransaction();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            return null;
        }
        if (this.session == null) {
            return null;
        }
        try {
            return this.session.beginTransaction();
        } catch (Throwable ex) {
//            ex.printStackTrace();
            this.session.close();
            throw ex;
//            this.session.disconnect();
//            this.session = getSessionFactory().openSession();
        }
//        return this.session.beginTransaction();
    }

    public void commitTransaction() {
        if (this.dataSource != null) {
            try {
                this.dataSource.commit();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            return;
        }
        if (this.session == null) {
            return;
        }
        try {
            if (this.session.getTransaction().isActive()) {
                this.session.getTransaction().commit();
            }
        } catch (Throwable ex) {
            ex.printStackTrace();
            this.session.close();
            throw ex;
//            this.session.disconnect();
//            this.session = getSessionFactory().openSession();
        }
    }

    public void rollbackTransaction() {
        if (this.dataSource != null) {
            try {
                this.dataSource.rollback();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            return;
        }
        if (this.session == null) {
            return;
        }
        try {
            if (this.session.getTransaction().isActive()) {
                this.session.getTransaction().rollback();
            }
        } catch (Throwable ex) {
            ex.printStackTrace();
            this.session.close();
//            this.session.disconnect();
//            this.session = getSessionFactory().openSession();
        }
    }
}

package com.anzhilai.core.database;

import com.anzhilai.core.framework.SpringConfig;
import com.anzhilai.core.toolkit.LogUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import javax.persistence.EntityManagerFactory;
import java.sql.SQLException;


public class DBSession {

    private Session hibernateSession = null;

    public DBSession(Session hibernateSession) {
        this.hibernateSession = hibernateSession;
    }

    public interface DbRunnable<T> {
        void run(T db) throws Exception;
    }

    public void UseOtherDB(DBBase db) {
        hibernateSession.setProperty("otherDB", db);
    }

    public void RemoveOtherDB() {
        hibernateSession.getProperties().remove("otherDB");
    }

    public <T extends DBBase> void UseOtherDB(T db, DbRunnable<T> runnable) throws Exception {
        UseOtherDB(db);
        try {
            db.beginTransaction();
            runnable.run(db);
            db.commit();
        } catch (SQLException e) {
            db.rollback();
            throw e;
        } finally {
            db.close();
            RemoveOtherDB();
        }
    }

    public interface Work {
        void execute(DBBase db) throws SQLException;
    }

    public DBBase GetCurrentDB() {
        DBBase db = (DBBase) hibernateSession.getProperties().get("otherDB");
        if (db == null) {
            db = (DBBase) hibernateSession.getProperties().get("mainDB");
        }
        if (db == null) {
            try {
                db = DBBase.CreateDB(DBBase.E_type.mysql, "", "", "", "");
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return db;
    }

    public void doWork(Work work) throws SQLException {
        DBBase odb = (DBBase) hibernateSession.getProperties().get("otherDB");
        if (odb != null) {
            work.execute(odb);
            return;
        }
        try {
            this.hibernateSession.doWork(conn -> {
                try {
                    DBBase db = DBBase.CreateDB(conn);
                    hibernateSession.setProperty("mainDB", db);
                    work.execute(db);
                } catch (Exception e) {
                    throw e;
                }
            });
        } catch (Exception e) {
            throw e;
        }
    }

    public void beginTransaction() throws SQLException {
        DBBase db = (DBBase) hibernateSession.getProperties().get("otherDB");
        if (db != null) {
            db.beginTransaction();
        }
        if (this.hibernateSession != null) {
            try {
                boolean active = this.hibernateSession.getTransaction().isActive();
                if (!active) {
                    this.hibernateSession.beginTransaction();
                }
            } catch (Throwable ex) {
                ex.printStackTrace();
                this.hibernateSession.close();
                throw ex;
            }
        }
    }

    public void commitTransaction() throws SQLException {
        DBBase db = (DBBase) hibernateSession.getProperties().get("otherDB");
        if (db != null) {
            db.commit();
        }
        if (this.hibernateSession != null) {
            try {
                if (this.hibernateSession.getTransaction().isActive()) {
                    this.hibernateSession.getTransaction().commit();
                }
            } catch (Throwable ex) {
                ex.printStackTrace();
                this.hibernateSession.close();
                throw ex;
            }
        }
    }

    public void rollbackTransaction() {
        DBBase db = (DBBase) hibernateSession.getProperties().get("otherDB");
        if (db != null) {
            try {
                db.rollback();
            } catch (SQLException throwables) {
                db.close();
            }
        }
        if (this.hibernateSession != null) {
            try {
                if (this.hibernateSession.getTransaction().isActive()) {
                    this.hibernateSession.getTransaction().rollback();
                }
            } catch (Throwable ex) {
                ex.printStackTrace();
                this.hibernateSession.close();
            }
        }
    }


    private static SessionFactory sessionFactory;

    public synchronized static DBSession getSession() {
        DBSession sessionManager = null;
        if (sessionFactory == null) {
            //DruidDataSource d = SpringConfig.getBean(DruidDataSource.class);
            EntityManagerFactory entityManagerFactory = SpringConfig.getBean("entityManagerFactory");

            if (entityManagerFactory.unwrap(SessionFactory.class) == null) {
                throw new NullPointerException("factory is not a hibernate factory");
            }
            sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
        }
        try {
            Session hibernateSession = sessionFactory.getCurrentSession();
            //Session session = sessionFactory.openSession();// 需要手动关闭
            sessionManager = new DBSession(hibernateSession);// 不需要手动关闭
        } catch (Exception e) {
            LogUtil.i("获取自动会话失败!");
            e.printStackTrace();
        }
        return sessionManager;
    }
}

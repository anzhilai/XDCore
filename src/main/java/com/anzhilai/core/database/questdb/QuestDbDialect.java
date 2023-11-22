package com.anzhilai.core.database.questdb;


import org.hibernate.boot.TempTableDdlTransactionHandling;
import org.hibernate.dialect.Dialect;
import org.hibernate.dialect.pagination.AbstractLimitHandler;
import org.hibernate.dialect.pagination.LimitHandler;
import org.hibernate.dialect.pagination.LimitHelper;
import org.hibernate.engine.spi.RowSelection;
import org.hibernate.hql.spi.id.IdTableSupportStandardImpl;
import org.hibernate.hql.spi.id.MultiTableBulkIdStrategy;
import org.hibernate.hql.spi.id.local.AfterUseAction;
import org.hibernate.hql.spi.id.local.LocalTemporaryTableBulkIdStrategy;

import java.sql.Types;

public class QuestDbDialect extends Dialect {
    private static final AbstractLimitHandler LIMIT_HANDLER = new AbstractLimitHandler() {
        @Override
        public String processSql(String sql, RowSelection selection) {
            final boolean hasOffset = LimitHelper.hasFirstRow(selection);
            return sql + (hasOffset ? " limit ? , ?" : " limit ?");
        }

        @Override
        public boolean supportsLimit() {
            return true;
        }

        @Override
        public boolean bindLimitParametersInReverseOrder() {
            return true;
        }
    };

    public QuestDbDialect() {
        super();
        registerColumnType(Types.BOOLEAN, "boolean");
        registerColumnType(Types.BIT, "byte");
//        registerColumnType(Types.short, "short");
        registerColumnType(Types.CHAR, "char");
        registerColumnType(Types.INTEGER, "int");
        registerColumnType(Types.FLOAT, "float");
//        registerColumnType(Types.symbol, "symbol");
        registerColumnType(Types.VARCHAR, "string");
        registerColumnType(Types.LONGVARCHAR, "string");
        registerColumnType(Types.BIGINT, "long");
        registerColumnType(Types.DATE, "date");
        registerColumnType(Types.TIMESTAMP, "date");
        registerColumnType(Types.DOUBLE, "double");
        registerColumnType(Types.BINARY, "binary");
        registerColumnType(Types.CLOB, "string");
        registerColumnType(Types.NCLOB, "string");
    }


    @Override
    public LimitHandler getLimitHandler() {
        return LIMIT_HANDLER;
    }

    @Override
    public boolean supportsLimit() {
        return true;
    }

    @Override
    public String getLimitString(String sql, boolean hasOffset) {
        return sql + (hasOffset ? " limit ? , ?" : " limit ?");
    }

    @Override
    public boolean bindLimitParametersInReverseOrder() {
        return true;
    }

    public boolean supportsCurrentTimestampSelection() {
        return true;
    }

    public boolean isCurrentTimestampSelectStringCallable() {
        return false;
    }

    public String getCurrentTimestampSelectString() {
        return "select current_timestamp";
    }

    public boolean supportsUnionAll() {
        return true;
    }

    public boolean hasAlterTable() {
        return false; // As specify in NHibernate dialect
    }

    public boolean dropConstraints() {
        return false;
    }

    public String getAddColumnString() {
        return "add column";
    }

    public String getForUpdateString() {
        return "";
    }

    public boolean supportsOuterJoinForUpdate() {
        return false;
    }

    public String getDropForeignKeyString() {
        throw new UnsupportedOperationException(
                "No drop foreign key syntax supported by SQLiteDialect");
    }

    public String getAddForeignKeyConstraintString(String constraintName,
                                                   String[] foreignKey, String referencedTable, String[] primaryKey,
                                                   boolean referencesPrimaryKey) {
        throw new UnsupportedOperationException(
                "No add foreign key syntax supported by SQLiteDialect");
    }

    public String getAddPrimaryKeyConstraintString(String constraintName) {
        throw new UnsupportedOperationException(
                "No add primary key syntax supported by SQLiteDialect");
    }

    public boolean supportsIfExistsBeforeTableName() {
        return true;
    }

    public boolean supportsCascadeDelete() {
        return false;
    }


    @Override
    public MultiTableBulkIdStrategy getDefaultMultiTableBulkIdStrategy() {
        return new LocalTemporaryTableBulkIdStrategy(
                new IdTableSupportStandardImpl() {
                    @Override
                    public String getCreateIdTableCommand() {
                        return "create temporary table if not exists";
                    }

                    @Override
                    public String getDropIdTableCommand() {
                        return "drop temporary table";
                    }
                },
                AfterUseAction.DROP,
                TempTableDdlTransactionHandling.NONE
        );
    }

}

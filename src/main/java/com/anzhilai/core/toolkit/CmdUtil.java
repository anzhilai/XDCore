package com.anzhilai.core.toolkit;

import com.anzhilai.core.database.AjaxResult;
import org.apache.log4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

public class CmdUtil extends Thread {
    public static Logger log = Logger.getLogger(CmdUtil.class);
    public boolean isClose = false;
    public String basePath;
    public String[] environment;
    public String[] cmds;
    public boolean isWindows;
    public Process process;
    public AjaxResult result = new AjaxResult();

    public CmdUtil() {
        this(null, null);
    }

    public CmdUtil(String basePath, String... cmds) {
        this.basePath = basePath;
        this.cmds = cmds;
        this.isWindows = System.getProperty("os.name").toLowerCase().startsWith("win");
    }

    public AjaxResult run(String cmd) {
        return run(cmd, new AjaxResult());
    }

    public AjaxResult run(String cmd, AjaxResult result) {
        boolean success = true;
        BufferedReader reader = null;
        BufferedReader readerError = null;
        String 换行 = "\r\n";
        StringBuffer stringBuffer = new StringBuffer();
        try {
            if (StrUtil.isNotEmpty(cmd)) {
                log.debug(cmd);
                stringBuffer.append(cmd + 换行);
                String[] command = null;
                if (isWindows) {
                    command = new String[]{"cmd", "/c", cmd};
                } else {
                    command = new String[]{"/bin/sh", "-c", cmd};
                }
                process = Runtime.getRuntime().exec(command, environment, StrUtil.isEmpty(basePath) ? null : new File(basePath));//脚本内容 环境变量 操作目录
                reader = new BufferedReader(new InputStreamReader(process.getInputStream(), Charset.forName("GBK")));
                String line;
                while ((line = reader.readLine()) != null) {
                    stringBuffer.append(line + 换行);
                }
                readerError = new BufferedReader(new InputStreamReader(process.getErrorStream(), Charset.forName("GBK")));//错误输出流
                while ((line = readerError.readLine()) != null) {
                    stringBuffer.append(line + 换行);
                }
            }
        } catch (Exception e) {
            success = false;
            e.printStackTrace();
            stringBuffer.append(e.getMessage());
        } finally {
            this.close(reader);
            this.close(readerError);
            this.close();
        }
        return result.setSuccess(success).setMessage(stringBuffer.toString());
    }

    public void close() {
        if (process != null) {
            process.destroy();
            process = null;
        }
        isClose = true;
    }

    private void close(AutoCloseable close) {
        if (close != null) {
            try {
                close.close();
            } catch (Exception e) {
            }
        }
    }

    public void kill(String pid) {
        String cmd = "";
        if (isWindows) {
            cmd = "taskkill /PID " + pid + " /t /f";
        } else {
            cmd = "pkill -P " + pid;
        }
        System.out.println(cmd);
        run(cmd);
    }

    //通过端口杀掉进程
    public void killPort(String port) {
        if (StrUtil.isNotEmpty(port)) {
            String cmd = "netstat -anp|grep :" + port;
            if (isWindows) {
                cmd = "netstat -ano|findstr :" + port;
            }
            AjaxResult ajaxResult = this.run(cmd);
            String message = ajaxResult.getMessage();
            if (StrUtil.isNotEmpty(message)) {
                for (String str : message.split("\r\n")) {
                    if (StrUtil.isNotEqual(str, cmd)) {
                        String[] strs = str.trim().replaceAll(" +", " ").split(" ");
                        if (strs.length > 1 && strs[strs.length - 2].toUpperCase().contains("LISTEN")) {
                            String pid = strs[strs.length - 1].replaceAll("/java", "");
                            if (StrUtil.isNotEmpty(pid)) {
                                this.kill(pid);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    @Override
    public void run() {
        if (cmds != null) {
            StringBuffer stringBuffer = new StringBuffer();
            for (String cmd : cmds) {
                if (!isClose) {
                    stringBuffer.append(run(cmd).getMessage());
                }
            }
            result.setMessage(stringBuffer.toString());
        }
    }
}

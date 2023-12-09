package com.anzhilai.core.toolkit;


import org.apache.commons.exec.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Scanner;

public class RuntimeUtil {

    /**
     * 执行不需要返回结果的命令
     * @throws Exception
     */
    public static void execCmdWithoutResult() throws Exception{
        //开启windows telnet: net start telnet
        //注意：第一个空格之后的所有参数都为参数
        CommandLine cmdLine = new CommandLine("net");
        cmdLine.addArgument("start");
        cmdLine.addArgument("telnet");
        DefaultExecutor executor = new DefaultExecutor();
        executor.setExitValue(1);
        //设置60秒超时，执行超过60秒后会直接终止
        ExecuteWatchdog watchdog = new ExecuteWatchdog(60 * 1000);
        executor.setWatchdog(watchdog);
        DefaultExecuteResultHandler handler = new DefaultExecuteResultHandler();
        executor.execute(cmdLine, handler);
        //命令执行返回前一直阻塞
        handler.waitFor();
    }

    /**
     * 带返回结果的命令执行
     * @return
     */
    public static String execCmdWithResult() {
        try {
            String command = "ping 192.168.1.10";
            //接收正常结果流
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            //接收异常结果流
            ByteArrayOutputStream errorStream = new ByteArrayOutputStream();
            CommandLine commandline = CommandLine.parse(command);
            DefaultExecutor exec = new DefaultExecutor();
            exec.setExitValues(null);
            //设置一分钟超时
            ExecuteWatchdog watchdog = new ExecuteWatchdog(60*1000);
            exec.setWatchdog(watchdog);
            PumpStreamHandler streamHandler = new PumpStreamHandler(outputStream,errorStream);
            exec.setStreamHandler(streamHandler);
            exec.execute(commandline);
            //不同操作系统注意编码，否则结果乱码
            String out = outputStream.toString("GBK");
            String error = errorStream.toString("GBK");
            return out+error;
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }



    /**
     * 杀死一个进程
     *
     * @param task
     */
    public static void killTask(String task) {

        try {
            Process process = Runtime.getRuntime().exec("taskList");
            Scanner in = new Scanner(process.getInputStream());
            int count = 0;
            while (in.hasNextLine()) {
                count++;
                String temp = in.nextLine();

                if (temp.contains(task)) {
                    String[] t = temp.split(" ");
                    // 判断该进程所占内存是否大于20M
                    if (Integer.parseInt(t[t.length - 2].replace(",", "")) > 20000) {
                        temp = temp.replaceAll(" ", "");
                        // 获得pid
                        String pid = temp.substring(9, temp.indexOf("Console"));
                        Runtime.getRuntime().exec("tskill " + pid);

                        // dos下开cmd窗口 ntsd -c q -p PID
                        // Runtime.getRuntime().exec("ntsd -c q -p 1528");
                    }
                }
                // System.out.println(count + ":" + temp);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    /**
     * 显示当前机器的所有进程
     */
    public static void showTaskList() {

        try {
            Process process = Runtime.getRuntime().exec("taskList");
            Scanner in = new Scanner(process.getInputStream());
            int count = 0;
            while (in.hasNextLine()) {
                count++;
                System.out.println(count + ":" + in.nextLine());
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    /**
     * 启动一个进程
     *
     * @param task
     */
    public static void startTask(String task) {
        try {
            Runtime.getRuntime().exec(task);

        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public static void runbat(String batfile,String file) {
        String cmd = "cmd /c start "+batfile;

        try {
            Process ps = Runtime.getRuntime().exec(cmd,null,new File(file));
            System.out.println(ps.getInputStream());
        } catch(IOException ioe) {
            ioe.printStackTrace();
        }
    }
    public static void runsh(String shfile) {
        final String shellcmd = " sudo sh  "+shfile;
        try {
            Process ps = Runtime.getRuntime().exec(shellcmd);
            System.out.println(ps.getInputStream());
        } catch(IOException ioe) {
            ioe.printStackTrace();
        }
    }
    public static void ExecuteAsyn(String command,String path) throws IOException {

        Process p = Runtime.getRuntime().exec(command, null, new File(path));
    }

    public static void ExecuteSyn(String command,String path) throws IOException {

        List<String> commandOutput = new ArrayList<>();
        Process p = Runtime.getRuntime().exec(command, null, new File(path));
        final InputStream is1 = p.getInputStream();
        new Thread(new Runnable() {
            public void run() {
                BufferedReader br = new BufferedReader(new InputStreamReader(is1));
                try {
                    String outputLine = null;
                    while ((outputLine = br.readLine()) != null)
                        commandOutput.add(outputLine);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
        InputStream is2 = p.getErrorStream();
        BufferedReader br2 = new BufferedReader(new InputStreamReader(is2));
        StringBuilder buf = new StringBuilder();
        String line = null;
        while ((line = br2.readLine()) != null) buf.append(line);
        System.out.println("result:" + buf);
        while (br2.readLine() != null) ;
        try {
            p.waitFor();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        p.exitValue();
        System.out.println(p.exitValue());
    }

    public static void KillProcess(String processID) {
        Properties props = System.getProperties();
        try {
            if (props.getProperty("os.name").contains("Windows")) {
                Runtime.getRuntime().exec("taskkill /im " + processID + " /f");
            }else {
                String[] cmd ={"sh","-c","killall -9 "+processID};
                // String command = "kill -9 "+fw.get服务进程id();
                Runtime.getRuntime().exec(cmd);
            }
        } catch (IOException ioe) {
        }
    }
    public static boolean findAndKillProcess(String processName) {
        boolean flag = false;
        Properties props = System.getProperties();
        try {
            if (props.getProperty("os.name").contains("Windows")) {
                Process p = Runtime.getRuntime().exec("cmd /c tasklist ");
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                InputStream os = p.getInputStream();
                byte b[] = new byte[256];
                while (os.read(b) > 0) {
                    baos.write(b);
                }
                String s = baos.toString();
                if (s.indexOf(processName) >= 0) {
                    Runtime.getRuntime().exec("taskkill /im " + processName + " /f");
                    flag = true;
                } else {
                    flag = false;
                }
            }else {
                Process p = Runtime.getRuntime().exec(new   String[]{"sh","-c","ps -ef | grep "+processName});
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                InputStream os = p.getInputStream();
                byte b[] = new byte[256];
                while (os.read(b) > 0) {
                    baos.write(b);
                }
                String s = baos.toString();
                if (s.indexOf(processName) >= 0) {
                    String[] cmd ={"sh","-c","killall -9 "+processName};
                    Runtime.getRuntime().exec(cmd);
                    flag = true;
                } else {
                    flag = false;
                }
            }
        } catch (IOException ioe) {
        }
        return flag;
    }
}

package com.anzhilai.core.toolkit;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class IOUtil {
    private static final int BUFFER_SIZE = 8192;

    private IOUtil() {
    }

    public static long write(InputStream is, OutputStream os) throws IOException {
        return write((InputStream)is, (OutputStream)os, 8192);
    }

    public static long write(InputStream is, OutputStream os, int bufferSize) throws IOException {
        long total = 0L;
        byte[] buff = new byte[bufferSize];

        while(is.available() > 0) {
            int read = is.read(buff, 0, buff.length);
            if (read > 0) {
                os.write(buff, 0, read);
                total += (long)read;
            }
        }

        return total;
    }

    public static String read(Reader reader) throws IOException {
        StringWriter writer = new StringWriter();

        String var2;
        try {
            write((Reader)reader, (Writer)writer);
            var2 = writer.getBuffer().toString();
        } finally {
            writer.close();
        }

        return var2;
    }

    public static long write(Writer writer, String string) throws IOException {
        StringReader reader = new StringReader(string);

        long var3;
        try {
            var3 = write((Reader)reader, (Writer)writer);
        } finally {
            reader.close();
        }

        return var3;
    }

    public static long write(Reader reader, Writer writer) throws IOException {
        return write((Reader)reader, (Writer)writer, 8192);
    }

    public static long write(Reader reader, Writer writer, int bufferSize) throws IOException {
        long total = 0L;

        int read;
        for(char[] buf = new char[8192]; (read = reader.read(buf)) != -1; total += (long)read) {
            writer.write(buf, 0, read);
        }

        return total;
    }

    public static String[] readLines(File file) throws IOException {
        return file != null && file.exists() && file.canRead() ? readLines((InputStream)(new FileInputStream(file))) : new String[0];
    }

    public static String[] readLines(InputStream is) throws IOException {
        List<String> lines = new ArrayList();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));

        String[] var4;
        try {
            String line;
            while((line = reader.readLine()) != null) {
                lines.add(line);
            }

            var4 = (String[])lines.toArray(new String[0]);
        } finally {
            reader.close();
        }

        return var4;
    }

    public static void writeLines(OutputStream os, String[] lines) throws IOException {
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(os));

        try {
            String[] arr$ = lines;
            int len$ = lines.length;

            for(int i$ = 0; i$ < len$; ++i$) {
                String line = arr$[i$];
                writer.println(line);
            }

            writer.flush();
        } finally {
            writer.close();
        }
    }

    public static void writeLines(File file, String[] lines) throws IOException {
        if (file == null) {
            throw new IOException("File is null.");
        } else {
            writeLines((OutputStream)(new FileOutputStream(file)), lines);
        }
    }

    public static void appendLines(File file, String[] lines) throws IOException {
        if (file == null) {
            throw new IOException("File is null.");
        } else {
            writeLines((OutputStream)(new FileOutputStream(file, true)), lines);
        }
    }
}

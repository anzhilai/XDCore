package com.anzhilai.core.toolkit.report;

import cn.hutool.core.util.StrUtil;
import com.anzhilai.core.base.BaseModel;
import com.anzhilai.core.framework.GlobalValues;
import com.anzhilai.core.toolkit.CmdUtil;
import com.anzhilai.core.toolkit.DateUtil;
import com.anzhilai.core.toolkit.ExcelWriteUtil;
import com.anzhilai.core.toolkit.HttpUtil;
import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.config.Configure;
import com.deepoove.poi.config.ConfigureBuilder;
import com.deepoove.poi.data.PictureRenderData;
import com.deepoove.poi.data.Pictures;
import com.deepoove.poi.plugin.table.LoopColumnTableRenderPolicy;
import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy;
import com.anzhilai.core.database.AjaxResult;
import fr.opensagres.poi.xwpf.converter.pdf.PdfConverter;
import fr.opensagres.poi.xwpf.converter.pdf.PdfOptions;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfCopy;
import com.itextpdf.text.pdf.PdfImportedPage;
import com.itextpdf.text.pdf.PdfReader;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.*;

public class WordUtil {
    public static String libOfficePath = "";

    public static void main(String[] args) throws IOException {
//        String path = "C:\\Users\\tangbin\\Desktop\\aa.docx";
//        word2pdf(path, path + ".pdf");
//        List<String> pdfLists = new ArrayList<>();
//        pdfLists.add("C:\\Users\\tangbin\\Desktop\\22.pdf");
//        mergePDF("C:\\Users\\tangbin\\Desktop\\11.pdf", pdfLists,
//                new FileOutputStream("C:\\Users\\tangbin\\Desktop\\33.pdf"));
    }

    public static boolean word2pdf(String wordPath, String pdfPath) {
        boolean ret = false;
        File file = new File(wordPath);
        if (file.exists()) {
            if (GlobalValues.baseAppliction != null) {
                try {
                    String _path = GlobalValues.baseAppliction.GetLibOfficePath();
                    if (StrUtil.isNotEmpty(_path)) {
                        libOfficePath = _path;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (StrUtil.isNotEmpty(libOfficePath)) {
                String path = file.getPath();
                String outPath = path.substring(0, path.lastIndexOf(".")) + ".pdf";
                File pdfFile = new File(pdfPath);
                String cmd = libOfficePath + " --headless --convert-to pdf:writer_pdf_Export " + path + " --outdir " + file.getParentFile().getPath();
                AjaxResult result = new CmdUtil().run(cmd);
                if (result.isSuccess() && new File(outPath).exists()) {
                    if (!outPath.equals(pdfFile.getPath())) {
                        if (pdfFile.exists()) {
                            pdfFile.delete();
                        } else {
                            pdfFile.getParentFile().mkdirs();
                        }
                        new File(outPath).renameTo(pdfFile);
                    }
                    return true;
                }
            }
            try (FileInputStream fileInputStream = new FileInputStream(wordPath);
                 XWPFDocument xwpfDocument = new XWPFDocument(fileInputStream);
                 FileOutputStream fileOutputStream = new FileOutputStream(pdfPath);) {
                PdfOptions pdfOptions = PdfOptions.create();
                PdfConverter.getInstance().convert(xwpfDocument, fileOutputStream, pdfOptions);
                ret = true;
            } catch (Exception e) {
//                e.printStackTrace();
            }
        }
        return ret;
    }

    public static boolean exportPdf(HttpServletResponse response, String name, String path, Map<String, Object> data) {
        String outPath = GlobalValues.GetTempPath() + File.separator + BaseModel.GetUniqueId() + ".doc";
        String pdfPath = outPath + ".doc.pdf";
        try {
            compileToWord(path, outPath, data);
            response.reset();
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename=" + new String(name.getBytes(ExcelWriteUtil.CHARSET_NAME), "ISO_8859_1") + ".pdf");
            word2pdf(outPath, pdfPath);
            HttpUtil.exportFile(response, pdfPath);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            File file = new File(outPath);
            if (file.exists()) {
                file.delete();
            }
            file = new File(pdfPath);
            if (file.exists()) {
                file.delete();
            }
        }
        return true;
    }

    public static boolean exportWrod(HttpServletResponse response, String name, String path, Map<String, Object> data) {
        OutputStream output = null;
        FileInputStream fis = null;
        try {
            response.reset();
            response.setContentType("application/x-msdownload");
            response.setHeader("Content-Disposition", "attachment; filename=" + new String(name.getBytes(ExcelWriteUtil.CHARSET_NAME), "ISO_8859_1") + ".docx");
            output = response.getOutputStream();
            compileToWord(path, output, data);
            output.flush();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            close(fis);
            close(output);
        }
        return true;
    }

    public static void headerProperty(ConfigureBuilder builder, LoopRowTableRenderPolicy rowTableRenderPolicy, LoopColumnTableRenderPolicy columnTableRenderPolicy, Map<String, Object> data) {
        Map<String, Object> newData = new HashMap<>();
        for (String key : data.keySet()) {
            Object value = data.get(key);
            if (value != null) {
                if (value instanceof List) {
                    List list = (List) value;
                    for (Object obj : list) {
                        if (obj != null && obj instanceof Map) {
                            headerProperty(builder, rowTableRenderPolicy, columnTableRenderPolicy, (Map) obj);
                        }
                    }
                    if (key.endsWith("表格列")) {
                        builder.bind(key, columnTableRenderPolicy);
                    } else if (key.endsWith("表格")) {
                        builder.bind(key, rowTableRenderPolicy);
                    }
                } else if (value instanceof Date) {
                    newData.put(key, DateUtil.ToString((Date) value, "yyyy年MM月dd日"));
                    newData.put(key + "_", value);
                }
            }
        }
        data.putAll(newData);
    }

    public static ConfigureBuilder getConfigureBuilder(Map<String, Object> data) {
        LoopRowTableRenderPolicy rowTableRenderPolicy = new LoopRowTableRenderPolicy();
        LoopColumnTableRenderPolicy columnTableRenderPolicy = new LoopColumnTableRenderPolicy();
        ConfigureBuilder builder = Configure.builder();
        headerProperty(builder, rowTableRenderPolicy, columnTableRenderPolicy, data);
//        builder.useSpringEL();
        return builder;
    }

    public static void compileToWord(String path, OutputStream outputStream, Map<String, Object> data) throws IOException {
        XWPFTemplate xwpfTemplate = XWPFTemplate.compile(path, getConfigureBuilder(data).build()).render(data);
        xwpfTemplate.write(outputStream);
        xwpfTemplate.close();
    }

    public static void compileToWord(String path, String outPath, Map<String, Object> data) throws IOException {
        XWPFTemplate xwpfTemplate = XWPFTemplate.compile(path, getConfigureBuilder(data).build()).render(data);
        xwpfTemplate.writeToFile(outPath);
        xwpfTemplate.close();
    }

    public static void close(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static PictureRenderData GetWordA4Image(String file) throws IOException {
        return GetWordA4Image(file, 660, 920);
    }

    public static PictureRenderData GetWordA4Image(String file, int maxWidth, int maxHeight) throws IOException {
        BufferedImage read = ImageIO.read(new File(file));
        String outputPath = GlobalValues.GetTemplateFilePath(BaseModel.GetUniqueId() + ".jpg");
        File outputFile = new File(outputPath);
        File parentFile = outputFile.getParentFile();
        if (!parentFile.exists()) {
            parentFile.mkdirs();
        }
        int height = read.getHeight();
        int width = read.getWidth();
        float h_zoom = (float) maxHeight / height;
        float w_zoom = (float) maxWidth / width;
        float zoom = 0f;
        if (h_zoom < 1 || w_zoom < 1) {
            if (h_zoom < w_zoom) {
                zoom = h_zoom;
            } else {
                zoom = w_zoom;
            }
            Thumbnails.of(read).scale(zoom).toFile(outputFile);
            return Pictures.ofLocal(outputPath).create();
        } else {
            return Pictures.ofLocal(file).create();
        }
    }

    public static String exportToPDFAndMerge(HttpServletResponse response, String templatePath, String outPutName, Map<String, Object> map, List<String> pdfLists) throws IOException {
        response.reset();
        response.setContentType("application/x-msdownload");
        response.setHeader("Content-Disposition", "attachment; filename=" + new String(outPutName.getBytes("utf-8"), "ISO_8859_1") + ".pdf");
        OutputStream outputStream = response.getOutputStream();
        compileToPDFAndMerge(outputStream, templatePath, map, pdfLists);
        outputStream.flush();
        WordUtil.close(outputStream);
        return null;
    }

    public static void compileToPDFAndMerge(String outputPath, String templatePath, Map<String, Object> map, List<String> pdfLists) throws IOException {
        File file = new File(outputPath);
//        file.mkdirs();
        File parentFile = file.getParentFile();
        if (!parentFile.exists()) {
            parentFile.mkdirs();
        }
        FileOutputStream fileOutputStream = new FileOutputStream(file);
        try {
            compileToPDFAndMerge(fileOutputStream, templatePath, map, pdfLists);
        } catch (Exception e) {
            throw e;
        } finally {
            WordUtil.close(fileOutputStream);
        }
    }

    public static void compileToPDFAndMerge(OutputStream outputStream, String templatePath, Map<String, Object> map, List<String> pdfLists) throws IOException {
        String ori_wordPath = GlobalValues.GetTempPath() + File.separator + BaseModel.GetUniqueId() + ".doc";//ori
        String ori_pdf = GlobalValues.GetTempPath() + File.separator + BaseModel.GetUniqueId() + ".pdf";//ori
        WordUtil.compileToWord(templatePath, ori_wordPath, map);
        WordUtil.word2pdf(ori_wordPath, ori_pdf);//转为pdf
        mergePDF(ori_pdf, pdfLists, outputStream);
    }

    public static void mergePDF(String pdfPath, List<String> fileList, OutputStream out) {
        Document document = new Document();
        ArrayList<String> files = new ArrayList<>();
        if (new File(pdfPath).exists()) {
            files.add(pdfPath);
        }
        if (fileList != null) {
            files.addAll(fileList);
        }
        if (files.size() == 0) {
            return;
        }
        try {
            FileInputStream inputStream = new FileInputStream(files.get(0));
            document = new Document(new PdfReader(inputStream).getPageSize(1));
            PdfCopy copy = new PdfCopy(document, out);//把doc拷贝到newf里面
            document.open();
            for (int i = 0; i < files.size(); i++) {
                FileInputStream input = new FileInputStream(files.get(i));
                PdfReader reader = new PdfReader(input);
                int n = reader.getNumberOfPages();
                for (int j = 1; j <= n; j++) {
                    document.newPage();
                    PdfImportedPage page = copy.getImportedPage(reader, j);
                    copy.addPage(page);
                }
                reader.close();
                WordUtil.close(input);
            }
            try {
                copy.flush();
                copy.close();
            } catch (Exception E) {
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                out.flush();
                out.close();
                document.close();
            } catch (Exception E) {
            }
        }
    }
}

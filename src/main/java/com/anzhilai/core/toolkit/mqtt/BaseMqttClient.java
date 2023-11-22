package com.anzhilai.core.toolkit.mqtt;

import com.anzhilai.core.toolkit.StrUtil;
import org.apache.log4j.Logger;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMParser;
import org.eclipse.paho.client.mqttv3.*;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;
import org.springframework.core.io.Resource;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.Security;
import java.security.cert.X509Certificate;
import java.util.Optional;

public class BaseMqttClient implements MqttCallback {
    private static final Logger log = Logger.getLogger(BaseMqttClient.class);

    public String clientId;
    public String url;
    public String userName;
    public String password;
    public String[] topicFilters;
    public MqttClient client;
    public MqttConnectOptions options;
    public boolean autoConnect = true;
    private boolean isClose = false;

    public BaseMqttClient() {
    }

    public BaseMqttClient(String url, String userName, String password, String[] topicFilters) {
        this.url = url;
        this.userName = userName;
        this.password = password;
        this.topicFilters = topicFilters;
    }

    public boolean validateUrl() {
        return StrUtil.isNotEmpty(url) && StrUtil.isNotEmpty(userName) && StrUtil.isNotEmpty(password);
    }

    public boolean init() {
        try {
            if (!this.validateUrl()) {
                return false;
            }
            Optional<SSLContext> context = initTrustManagers().map(trustManagers -> {
                try {
                    SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
                    sslContext.init(null, trustManagers, new SecureRandom());
                    return sslContext;
                } catch (Exception e) {
                    log.error("failed load", e);
                    return null;
                }
            });
            if (StrUtil.isEmpty(clientId)) {
                clientId = MqttClient.generateClientId();
            }
            options = new MqttConnectOptions();
            options.setUserName(userName);
            options.setPassword(password.toCharArray());
            context.ifPresent(sslContext -> options.setSocketFactory(sslContext.getSocketFactory()));

            client = new MqttClient(url, clientId, new MemoryPersistence());
            client.setCallback(this);
            return StartConnect();
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private Optional<KeyStore> loadKeyStore() {
        X509Certificate cert;
        Resource caFile = null;
        if (caFile == null) {
            return Optional.empty();
        }
        try (InputStream is = caFile.getInputStream()) {
            InputStreamReader isr = new InputStreamReader(is);
            PEMParser parser = new PEMParser(isr);
            X509CertificateHolder holder = (X509CertificateHolder) parser.readObject();
            cert = new JcaX509CertificateConverter().getCertificate(holder);
            KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", cert);
            return Optional.of(keyStore);
        } catch (Exception e) {
            log.error("failed load", e);
            return Optional.empty();
        }
    }

    private Optional<TrustManager[]> initTrustManagers() {
        return loadKeyStore().map(keyStore -> {
            try {
                Security.addProvider(new BouncyCastleProvider());
                TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                tmf.init(keyStore);
                return tmf.getTrustManagers();
            } catch (Exception e) {
                log.error("failed load", e);
                return null;
            }
        });
    }

    public boolean isConnected() {
        boolean ret = false;
        if (client != null) {
            ret = client.isConnected();
        }
        return ret;
    }

    public boolean StartConnect() {
        if (client == null) {
            return false;
        }
        if (!client.isConnected() && !isClose) {
            try {
                client.connect(options);
                if (topicFilters != null) {
                    client.subscribe(topicFilters);
                }
                connectSuccess();
                if (client.isConnected()) {
                    return true;
                } else {
                    reConnect();
                }
            } catch (Exception e) {
                reConnect();
            }
        }
        return client.isConnected();
    }

    private void reConnect() {
        if (autoConnect) {
            new Thread(new Runnable() {
                public void run() {
                    try {
                        Thread.sleep(10000);//10秒后重新连接
                    } catch (Exception ex) {
                    }
                    log.info("mqtt fail connect ReConnect");
                    StartConnect();
                }
            }).start();
        }
    }

    @Override
    public void connectionLost(Throwable throwable) {//可能网络断开
        log.info("connectionLost", throwable);
        this.StartConnect();
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
    }

    public void close() {
        isClose = true;
        if (client != null) {
            try {
                if (client.isConnected()) {
                    client.disconnect();
                }
            } catch (MqttException e) {
                e.printStackTrace();
            } finally {
                try {
                    client.close();
                } catch (MqttException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void connectSuccess() {
    }

    public void messageArrived(String s, MqttMessage message) throws Exception {
    }

    public static void main(String[] args) {
        BaseMqttClient client = new BaseMqttClient("tcp://47.98.101.227:1883", "admin", "Zennze#20130828;", null);
        System.out.println("connect:" + client.init());
        client.close();
    }
}

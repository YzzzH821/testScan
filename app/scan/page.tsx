'use client';
import { useRef, useEffect, useState } from 'react';
import { BrowserQRCodeReader,BrowserCodeReader } from '@zxing/browser';

export default function AutoScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // 🔴 关键：页面加载完自动启动
  useEffect(() => {
    startScan();
    return () => {
      stopScan(); // 离开页面自动释放摄像头
    };
  }, []);

  // 开始扫码
  const startScan = async () => {
    if (!videoRef.current) return;
    if (controlsRef.current) return; // 已在运行，避免重复启动

    const codeReader = new BrowserQRCodeReader();
    let devices;
    try {
      devices = await BrowserCodeReader.listVideoInputDevices();
    } catch (e) {
      alert('获取摄像头列表失败：' + e);
      return;
    }

    if (devices.length === 0) {
      alert('未找到摄像头设备');
      return;
    }

    // 优先后置摄像头（手机），没有就用第一个
    const deviceId = devices.length > 1
      ? devices[1].deviceId
      : devices[0].deviceId;

    try {
      const controls = await codeReader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (res, err) => {
          if (res) {
            // 扫码成功
            setResult(res.text);
            stopScan(); // 拿到结果自动暂停
          }
          // 正常“没扫到”的 err 不用处理
        }
      );
      controlsRef.current = controls;
      setIsScanning(true);
    } catch (e) {
      alert('打开摄像头失败，请先授权：' + e);
    }
  };

  // 暂停/停止扫码
  const stopScan = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setIsScanning(false);
  };

  // 重新扫码
  const restartScan = () => {
    setResult(null);
    startScan();
  };

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h3>自动扫码（进入页面即开启）</h3>

      <video
        ref={videoRef}
        playsInline
        muted
        style={{ width: '100%', maxWidth: 400, border: '1px solid #ccc' }}
      />

      <div style={{ marginTop: 10 }}>
        {isScanning ? (
          <button onClick={stopScan} style={{ margin: 5 }} tabIndex={-1} >
            暂停扫码
          </button>
        ) : (
          <button onClick={restartScan} style={{ margin: 5 }} tabIndex={-1}>
            重新扫码
          </button>
        )}
      </div>

      {result && (
        <div style={{ marginTop: 15, color: 'green' }}>
          <p>扫码结果：{result}</p>
        </div>
      )}
    </div>
  );
}
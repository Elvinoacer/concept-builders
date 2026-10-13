export default function PausedDeployment() {
  return (
    <main
      aria-live="polite"
      aria-labelledby="paused-deployment-title"
      role="status"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: 0,
        padding: 0,
        textAlign: 'center',
        pointerEvents: 'all',
        userSelect: 'none'
      }}
    >
      <h1
        id="paused-deployment-title"
        style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: 1.2
        }}
      >
          This deployment is temporarily paused
      </h1>
      <p
        aria-label="Deployment identifier"
        style={{
          position: 'absolute',
          right: 0,
          bottom: '36px',
          left: 0,
          margin: 0,
          color: '#737373',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: 1.25
        }}
      >
        bom1::9rhwz-1791911307845-6d5971c7b8c4
      </p>
    </main>
  );
}
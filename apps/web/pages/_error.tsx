// Custom error page - override Next.js built-in _error to avoid styled-jsx/React conflict in monorepo builds
import type { NextPageContext } from 'next';

interface Props {
  statusCode?: number;
}

function Error({ statusCode }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#4A3728' }}>
        {statusCode || '???'}
      </h1>
      <p style={{ color: '#706A61', marginTop: '1rem' }}>
        {statusCode === 404 ? 'Không tìm thấy trang này.' : 'Đã có lỗi xảy ra.'}
      </p>
      <a href="/" style={{ marginTop: '2rem', display: 'inline-block', color: '#9C6644' }}>
        ← Về trang chủ
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 404;
  return { statusCode };
};

export default Error;

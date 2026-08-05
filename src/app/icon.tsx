import {ImageResponse} from 'next/og';

export const size = {width: 32, height: 32};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#6B4A31',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            fontWeight: 900,
            color: '#F7F1E7',
            fontFamily: 'sans-serif',
          }}
        >
          P
        </div>
      </div>
    ),
    {...size},
  );
}

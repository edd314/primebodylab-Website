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
          background: '#D7FF3D',
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
            color: '#0A0A0A',
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

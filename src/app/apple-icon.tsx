import {ImageResponse} from 'next/og';

export const size = {width: 180, height: 180};
export const contentType = 'image/png';

export default function AppleIcon() {
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
            fontSize: 120,
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

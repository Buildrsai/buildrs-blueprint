import {Composition} from 'remotion';
import {HelloWorld} from './HelloWorld';
import {NoahAI} from './NoahAI';
import {BuildrsBlueprintAd} from './BuildrsBlueprintAd';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={120}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
      <Composition
        id="NoahAI"
        component={NoahAI}
        durationInFrames={450}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
      <Composition
        id="BuildrsBlueprintAd"
        component={BuildrsBlueprintAd}
        durationInFrames={1200}
        width={1080}
        height={1920}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};

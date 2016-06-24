// Simple wrapper exposing environment variables to rest of the code.

import jetpack from 'fs-jetpack';

// The variables have been written to `env.json` by the build process.
var env = jetpack.cwd(__dirname).read('env.json', 'json');
env.appUserModelId = '711a32ac-1679-478f-981b-360afca5ce03';
env.autoUpdateFeedUrl = 'http://ec2-52-64-55-12.ap-southeast-2.compute.amazonaws.com:1337/update'; // TODO: Remove from here & add to env_XX.
export default env;

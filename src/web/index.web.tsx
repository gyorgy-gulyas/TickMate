import { AppRegistry } from 'react-native';
import App from '../../App';
import { installFonts } from './fonts';

installFonts();

AppRegistry.registerComponent('TickMate', () => App);
AppRegistry.runApplication('TickMate', {
  rootTag: document.getElementById('root'),
});

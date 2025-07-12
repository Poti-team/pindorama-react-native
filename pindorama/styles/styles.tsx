import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF9E4',
    padding: 0,
    margin: 0,
    width: screenWidth,
  },
  conteudo: {
    paddingTop: 80,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 40,
    margin: 0,
    width: '100%',
    maxWidth: 500,
    gap: 40,
  },
  title: {
    fontSize: 36,
    fontFamily: 'IrishGrover-Regular', // Use o nome da fonte carregada
    color: '#642C08',
    textAlign: 'left',
  },
  text: {
    fontSize: 16,
    fontFamily: 'IrishGrover-Regular', // Use o nome da fonte carregada
    color: '#642c08'
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#FFE192',
    borderColor: '#956046',
    borderWidth: 2,
    borderRadius: 2,
    fontSize: 16,
    fontFamily: 'IrishGrover-Regular', // Use o nome da fonte carregada
    color: '#642c08',
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#EACA92',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderColor: '#AC7641',
    borderWidth: 3,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAuth: {
    backgroundColor: '#EFAD00',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderColor: '#642C08',
    borderWidth: 2,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#642c08',
    fontSize: 16,
    fontFamily: 'IrishGrover-Regular', // Opcional
  },
  div: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  menu: {
    width : '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#EACA92',
    paddingVertical: 16,
    gap: 40,
    paddingHorizontal: 40,
    zIndex: 1000,
  },
  absolute: {
    position: 'absolute',
    zIndex: 0,
  },
  placa_home: {
     width: '100%',
     justifyContent: 'flex-start',
     alignItems: 'center',
     gap: 10,
  },
  placa: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popUpContainer: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight + 40,
    backgroundColor: '#95604650',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  popUpDisplay: {
    width: screenWidth - 80,
    padding: 32,
    backgroundColor: '#956046',
    borderWidth: 4,
    borderColor: '#642C08',
    borderRadius: 20,
  },
  abz: {
    fontFamily: 'ABeeZee-Regular'
  },
  header: {
    width: '100%',
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  }
});
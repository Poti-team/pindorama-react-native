import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    width: screenWidth,
    gap: 40,
  },
  title: {
    fontSize: 40,
    fontFamily: 'IrishGrover-Regular', // Use o nome da fonte carregada
    color: '#642C08',
    textAlign: 'left',
  },
  text: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: 'IrishGrover-Regular', // Use o nome da fonte carregada
    color: '#642c08'
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
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
    width : screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EACA92',
    paddingVertical: 10,
    gap: 40,
    paddingHorizontal: 40,
  },
  absolute: {
    position: 'absolute',
    zIndex: 0,
  },
  placa_home: {
     flex: 3,
     width: '100%',
     justifyContent:
     'flex-start',
     alignItems: 'center',
     gap: 10,
     paddingBottom: 150,
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
    zIndex: 1000,
  },
  popUpDisplay: {
    width: screenWidth - 80,
    padding: 32,
    backgroundColor: '#956046',
    borderWidth: 4,
    borderColor: '#642C08',
    borderRadius: 20,
  }
});
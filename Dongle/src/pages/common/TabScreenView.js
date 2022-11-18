import React from 'react';
import {
  View, TouchableWithoutFeedback,
  Image, Dimensions,
  Text, StatusBar, TextInput,
  StyleSheet, FlatList,
} from 'react-native'
import NestedScrollView from 'react-native-nested-scroll-view'

class TabScreenView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }, {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }, {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }, {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }, {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }, {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }, {
          title: 'FOX',
          desc: 'filecoin Blockchain',
          url: 'https://pancakeswap.finance/swap#/swap',
          imag: require('../../assets/img/' + 1 + '.png'),
        }
      ],
    }
  }

  componentDidMount() {
  }

  //页面跳转
  onNavPage = (item) => {
    //跳转Web3页面
    if (item.indexOf("https") != -1) {
      console.debug('网页')
      return
    }
    this.props.navigation.push(item);
  }

  renderScroll(props) {
    return (
      <NestedScrollView {...props} />
    )
  }

  render() {
    let { list } = this.state;

    let renderRecommendItem = ({ item }) => {
      return (
        <TouchableWithoutFeedback onPress={this.onNavPage.bind(this, item.url)}>
          <View style={{ display: 'flex', flexDirection: 'row', height: 55, alignItems: 'center', marginLeft: 16, marginTop: 5, marginBottom: 5 }}>
            <Image style={{ width: 55, height: 55, borderRadius: 14 }} source={item.imag} />
            <View style={{ width: 210, marginLeft: 12, flex: 1 }}>
              <Text style={{ color: '#1E1E1E', fontSize: 17, fontWeight: 'bold' }}>
                {item.title}
              </Text>
              <Text style={{ color: '#C0C0C0', fontSize: 12, marginTop: 3 }}>
                {item.desc}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    }


    return (
      <NestedScrollView style={styles.container} >

        <FlatList
          data={list}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderRecommendItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderScrollComponent={this.renderScroll}
        />

      </NestedScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
})

export default TabScreenView;

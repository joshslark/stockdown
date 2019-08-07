import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase("storage.db");

export default class Barcodes extends React.Component {
  state = {
    barcodes: null,
  };

  add(data) {
    if ((data === null) | (data === '')) {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql('insert into barcodes (data) values (?) ', [data]);
        tx.executeSql('select * from barcodes', [], (_, { rows }) =>
          console.log(JSON.stringify(rows.raw()))
        );
      },
      this.handleError,
      this.update
    );
  }

  update = () => {
    console.log ("Updating from database");
    this.barcodesList && this.barcodesList.update();
  };

  handleError = (e) => {
    console.log (e);
  };
  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        `create table if not exists barcodes (id integer primary key not null, data text);`
      );
    });
  }

  componentDidUpdate() {
  }

  _renderBarcode = ({item}) => (
      <View style={styles.listItemLeftMargin}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>{item.data}</Text>
        </View>
      </View>
  );


  clearDB () {
    db.transaction (
      tx => {
        tx.executeSql('delete from barcodes;', [])
        },
        this.handleError,
        () => this.setState({barcodes: null})
    );
    console.log("Clearing database");
  }

  update = () => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from barcodes`,
        [],
        (tx, rs) => {
          this.setState({ barcodes: rs.rows.raw()});
          console.log("New list: " + rs.rows.raw());
        },
        this.handleError
      );
    });

    this.flatlist && this.flatlist.scrollToEnd({ animated: true });
  }

  handleError = (e) => {
    console.log(e);
  }

  render() {
    const { barcodes } = this.state;
    if (barcodes === null) {
      return null;
    } 
    else {
      return (
        <View style={ styles.listContainer }>
          <View
            style={{backgroundColor:"white"}}>
            <Button
              onPress={this.clearDB.bind(this)}
              title={"Clear List"}
            />
          </View>
          <View>
            <FlatList
              ref={ref => {
                this.flatlist = ref;
              }}
              data={this.state.barcodes}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this._renderBarcode}
            />
          </View>
        </View>
      );
    }
  }
}

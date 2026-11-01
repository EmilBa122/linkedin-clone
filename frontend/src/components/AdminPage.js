import React, { useEffect, useState, useRe, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import styles from "./AdminPage.module.css";
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory,{textFilter} from 'react-bootstrap-table2-filter';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toXML } from 'jstoxml';
import { NavLink } from 'react-router-dom';
import { LuLogOut } from "react-icons/lu";


//import {Table} from 'react-bootstrap';


const Admin = () => {
    const [data, setData] = useState([]);
    //const [data_l, setDataL] = useState([]);

    const [comment_, setComment] = useState(null);

    const { user,admin, setAdmin } = useContext(AuthContext);
    const history = useHistory();
    
    if((admin === null && user !== null && user.isAdmin !== "yes") || admin === undefined){
        history.goBack();
        return null;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchUsers = await fetch(`https://localhost:8443/api/admin?admin=${admin?._id}`,{ 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials (cookies)
                })
                .then((res) => res.json())
                .then((data) => {
                    //data.forEach(obj,index => obj._id=index);
                    data.map((d,index) =>(d._id2=index));
                    data.map((d,index) =>(d.Name=d.first_name + " " + d.last_name))
                    //console.log(data)
                    setData(data);
                });
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [admin, user]);
    
    const UsingArrayMap = () => (
        <div>
        {
            data.map((user, index) => (
                <div key={index}>{user.email}</div>
                
            ))
        }
        </div>
    );

    const selectRow = {
        mode:"checkbox",
        clickToSelect: true,
    }

    const columns = [
      {
        dataField: "Name",
        text: "Name",
        /*formatter: (cell, row) => {
            console.log(row);
            return <div>{`${row.first_name} ${row.last_name}`}</div>;
        },*/
        filter: textFilter(),
      },
      {
        dataField: "email",
        text: "Email",
        filter: textFilter(),
      },
      {
        dataField: "phone_number",
        text: "Phone",
      },
    ]
    const tableRef = createRef();

    function handleGetSelectedData(e) {
        console.log(tableRef.current.selectionContext.selected);
    }

    const findCommentOnPost = async (comment) =>{
       //var comment_ = comment;
       //setComment(comment);
       //console.log('comment',comment_);
        var c = comment;
       //console.log('comment',comment);

        //while(comment_.comment !== null){
          const response = await fetch(`https://localhost:8443/api/admin/findCommentOnPost?id=${comment.comment}`,{ 
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials (cookies)
          })
          .then((res) => res.json())
          .then((data) => {
              console.log('data2',data);
              comment = data[0];
              console.log('co',comment);

              //setComment(data[0]);
              if (data[0].comment !== null){
                 comment = findCommentOnPost(data[0]);
              }
              setComment(comment);
              return comment;
              
          });


        const parsed = await response;
        console.log('r',c);
        console.log('a',parsed.post);

        setComment(response.post);
        fetch(`https://localhost:8443/api/admin/update?post_id=${parsed.post}&comment_id=${c._id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              },
          credentials: 'include', // Include credentials (cookies)
        })
          .catch(error => {
            console.log(error);
          });
        
        return parsed;
    }

    const getComment = async (id) =>{
      const response = await fetch(`https://localhost:8443/api/admin/getComment?id=${id}`,{ 
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials (cookies)
      })
      .then((res) => res.json())
      .then((data) => {
          //data.forEach(obj,index => obj._id=index);
          var comments_data = data[0];
          var posts_data = data[1];
          var friends_data = data[2];

          var posts = [];
          var post_flag = 0;
          var nestedComments = [];
          comments_data.map(comment_ => {
            post_flag = 0;
            //console.log('c',comment_.post)
            if (comment_.post !== null){
              // find if post is in posts
              posts?.map((post_,index) =>{
                if (post_.post_id === comment_.post){
                  //post_flag = 1; post_ = change posts? keep index change after map
                  post_flag = 1;
                  posts[index].comments.push(comment_);
                }
              })
              //not found post in posts
              if (post_flag === 0){
                  posts.push({"post_id": comment_.post, "comments": [comment_]})
              }
            }
            else{
                var post_id = findCommentOnPost(comment_);
                nestedComments.push(comment_);

            };

          })

          return [posts,nestedComments,posts_data,friends_data]
      });
      // const response2 = fetch(`https://localhost:8443/api/admin/getNested?id=${comment_._id}`,{ 
      //   headers: {
      //       'Content-Type': 'application/json',
      //   },
      //   credentials: 'include', // Include credentials (cookies)
      // }).then((res) => res.json())
      // .then((data) => {
      //     console.log('respone2',data);
      //     return data;
      // })
      const result = await response; 
      var post_flag;
      var posts = result[0];

      result[1].map(comment_ => {
                  post_flag = 0;
                  posts?.map((post_,index) =>{
                  if (post_.post_id === comment_.nested_in_post){
                    post_flag = 1;
                    posts[index].comments.push(comment_);
                  }
                })
                //not found post in posts
                if (post_flag === 0){
                    posts.push({"post_id": comment_.nested_in_post, "comments": [comment_]})
                }
      })
      console.log('posts',posts);
      if (posts.length === 0){
        posts ="empty";
        return [posts,result[2],result[3]];
      }
      console.log('result',posts);
      return [posts,result[2],result[3]];
      // if (response.ok()){

      // }

    }

    const exportData = () => {
        //setDatajSON({["users"]: data})
        console.log(tableRef.current)
        console.log(tableRef.current.selectionContext.selected)
        const selectedArray = tableRef.current.selectionContext.selected;
        const selectedData = [];
        var result = [];
        var d;
        for (let i = 0; i < selectedArray.length; i++) {
            selectedData.push(data[selectedArray[i]]);
            d = getComment(data[selectedArray[i]]._id);
            result.push(d);
        }
        console.log('rr',result);
        var index = 0;
        //if (result.length ===  selectedArray.length){
          var data_l = [];
          for (let j = 0; j < result.length; j++){
            result[j].then((val) => {
              console.log('val',val);
              data[selectedArray[j]]["comments"] = val[0];
              data[selectedArray[j]]["posts"] = val[1];
              data[selectedArray[j]]["friends"] = val[2];

              
              console.log('post_data',data[selectedArray[j]].posts);
              if (j === result.length - 1){
                
                for (let k = 0; k < result.length; k++){
                  data_l.push(data[selectedArray[k]]);
                }
                  const dataJson = {["users"]: data_l}
                  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                      JSON.stringify(dataJson, null, 2)
                  )}`;
                  const link = document.createElement("a");
                  link.href = jsonString;
                  link.download = "data.json";
              
                  link.click();
                }
              
            })
          }
          console.log('post_data_l',data_l);

    };

 
    const exportXml = () => {        
        const selectedArray = tableRef.current.selectionContext.selected;
        const selectedData = [];
        var result = [];
        var d;
         for (let i = 0; i < selectedArray.length; i++) {
             selectedData.push(data[selectedArray[i]]);
             d = getComment(data[selectedArray[i]]._id);
             result.push(d);
         }

         var data_l = [];
         for (let j = 0; j < result.length; j++){
            result[j].then((val) => {
              console.log('val',val);
              data[selectedArray[j]]["comments"] = val[0];
              data[selectedArray[j]]["posts"] = val[1];
              data[selectedArray[j]]["friends"] = val[2];
              
              console.log('post_data',data[selectedArray[j]].posts);
              if (j === result.length - 1){
                
                for (let k = 0; k < result.length; k++){
                  data_l.push(data[selectedArray[k]]);
                }
                const config = {
                  indent: '    '
                };
                const xml = toXML(data_l, config);
                const blob = new Blob([xml], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url
                link.download = "data.xml";
            
                link.click();
    
              }
             
           })
         }

    };


    //data.map((d,index) =>(d._id=index))
    //data.map((d,index) =>(d.Name=d.first_name + " " + d.last_name))
    return (
        /*<div>
            <h1>Welcome</h1>
            {JSON.stringify(data)}
        </div>*/

       /* <div>
            {data && data.map((user,index) =>
            <tr key={index}>
            <td>{user.email}</td>
            </tr>
        )}
        </div>*/
    /*<div>
        {
            data.map((user, index) => (
                <div key={index}>{user.email}</div>
                
            ))
        }
        {JSON.stringify(data[0])}
        {data[0] && (
            <div>{data[0].email}</div>
        )} 
        <UsingArrayMap />
    </div>*/

  
    <div style={{position: "sticky", top: "0"}}>
        <header className="App-header p-3">
          <h1>Linked in</h1>
        </header>

        <a className="nav-link" href="https://localhost:8443/api/logout" style={{display: 'inline', float: "right"}}>
          <LuLogOut size={24} /><br />
          Sign Out
        </a>
        <div className={styles.table1}>
          <div className={styles.table2}>
            <BootstrapTable 
            ref={ tableRef }
            data={data}
            keyField='_id2'
            columns={columns}
            striped
            hover
            condensed
            selectRow={selectRow}
            pagination={paginationFactory()}
            filter={filterFactory()}
            />
          </div>
        </div>
        {/*<button className="btn btn-default" onClick={ handleGetSelectedData }>Get Current Selected Rows</button>*/}
        <button type="button" onClick={exportData}>
            Export Data
        </button>
        <button type="button" onClick={exportXml}>
            Export Xml
        </button>
    </div>
    );
};

export default Admin;
import React, { useEffect, useState } from 'react'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import {collection,query,orderBy} from 'firebase/firestore'
import db from '../database/firebase'

const Datas = () => {
    const dataRef:any=query(collection(db, 'forms'), orderBy('createdAt', 'desc'));
    const[data,isLoading]=useCollectionData(dataRef);



    if(isLoading){
        return <h1 className='data-container'>Loading...</h1>
    }

    console.log(data);
  
    return (
        <div className='data-container'>
            {data?.map((form, index) => (
                <div className='form-container' key={form.id}>
                    <div className="card-header">
                        <p>New Title #{index+1}</p>
                    </div>
                    <div className='form-body'>
                        <input type="text" id="title" className='form-title' value={form.title} disabled/>
                        <textarea name="" value={form.content} id="content" className='form-content' cols={30} rows={10} disabled/>
                        <div className='imageBox'>
                            <img src={form.imagePath} alt="Image"  />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}


export default Datas

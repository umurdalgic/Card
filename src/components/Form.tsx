import React, { useState, useCallback, useEffect } from "react";
import db, { storage } from "../database/firebase";
import "./../css/Card.css";
import "./../css/ImageInput.css";
import AddIcon from "@mui/icons-material/Add";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import {
	ref as storageRef,
	uploadBytes,
	getDownloadURL,
} from "firebase/storage";
import generateGuid from "../funcs/NewGuid";

const Form = () => {
	const [isSelectedImage, setIsSelectedImage] = useState<boolean>(false); //resim seçip seçmediğimizi kontrol eden state
	const [isWroteTitle, setIsWroteTitle] = useState<boolean>(false); //title girilip girilmedini kontrol eden metot
	const [isWroteContent, setIsWroteContent] = useState<boolean>(false); //content girilip girilmediğini kontrol eden metot
	const [title, setTitle] = useState("New Title");
	const [content, setContent] = useState("New description.");
	const [guid, setGuid] = useState<string | null>(null);
	const [imageExtension, setImageExtension] = useState<string>("");
	const [selectedImage, setSelectedImage] = useState<{
		name: string;
		url: string;
	} | null>(null);
	const [image, setImage] = useState(null);

	const handleOnFocus = (event: any) => {
		event.target.select();
	};

	const ref = collection(db, "forms");

	const handleSubmit = useCallback(
		(event: any) => {
			setGuid(generateGuid);
			event.preventDefault();
			addDoc(ref, {
				content: content,
				title: title,
				imagePath: guid + imageExtension,
				createdAt: new Date(),
			})
				.then((formRef) => {
					const formId = formRef.id;
					if (image) {
						const imageName: string = guid + imageExtension;
						const imageRef = storageRef(
							storage,
							`photos/${imageName}`
						);
						uploadBytes(imageRef, image)
							.then(() => {
								getDownloadURL(imageRef)
									.then((val) => {
										setDoc(
											doc(ref, formId),
											{ imagePath: val },
											{ merge: true }
										).catch((error) => {
											console.log(
												"Error adding download URL to document:",
												error
											);
										});
									})
									.catch((error) => {
										console.log(
											"Error getting download URL:",
											error
										);
									});
							})
							.catch((error) => {
								console.log("Error uploading image:", error);
							});
					}

					setTitle("New Title");
					setContent("New description.");
					setSelectedImage(null);
					setIsWroteContent(false);
					setIsWroteTitle(false);
					setIsSelectedImage(false);
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		},
		[title, content, guid, image, imageExtension]
	);

	const handleOnChange = (event: any) => {
		setImage(event.currentTarget.files[0]);
		const imageForName = event.currentTarget.files[0];
		if (imageForName) {
			setImageExtension(
				imageForName.name.substring(imageForName.name.lastIndexOf("."))
			);
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage({
					name: imageForName.name,
					url: reader.result as string,
				});
			};
			setIsSelectedImage(true);
			reader.readAsDataURL(imageForName);
		}
	};

	//Başka yere tıklandığında eğer boşsa tekrar içini dolduran metot
	const handleOnBlurTitle = (event: any) => {
		if (event.target.value == "") {
			setTitle("New Title");
			setIsWroteTitle(false);
		}
	};

	//Başlığı değiştirmemize yarayan metot
	const handleChangeTitle = (event: any) => {
		setTitle(event.target.value);
		setIsWroteTitle(true);
	};

	//İçeriği değiştirmemize yarayan metot
	const handleChangeContent = (event: any) => {
		setContent(event.target.value);
		setIsWroteContent(true);
	};

	const handleOnBlurContent = (event: any) => {
		if (event.target.value == "") {
			setContent("New description.");
			setIsWroteContent(false);
		}
	};

	return (
		<div className="container">
			<div className="form-container">
				<div className="card-header">
					<p>New Title</p>
				</div>
				<div className="form-body">
					<form action="post" onSubmit={handleSubmit}>
						<input
							type="text"
							id="title"
							className="form-title"
							value={title}
							onChange={handleChangeTitle}
							onFocus={handleOnFocus}
							onBlur={handleOnBlurTitle}
						/>
						<textarea
							name=""
							value={content}
							id="content"
							className="form-content"
							onChange={handleChangeContent}
							onFocus={handleOnFocus}
							onBlur={handleOnBlurContent}
							cols={30}
							rows={10}
						/>
						<div className="imageBox">
							{selectedImage ? (
								<img src={selectedImage.url} alt="Selected" />
							) : (
								<>
									<input
										type="file"
										accept="image/*"
										id="image"
										onChange={handleOnChange}
									/>
									<label htmlFor="image" className="file-btn">
										<span className="material-symbols-rounded">
											<AddIcon />
										</span>
										GÖRSEL
									</label>
								</>
							)}
						</div>
						<div className="submit">
							{isSelectedImage &&
							isWroteTitle &&
							isWroteContent ? (
								<input
									type="submit"
									className="submitButton"
									value=""
								/>
							) : (
								<div className="submitButton disabled"></div>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;

import {Component, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { chatInput } from './chatInput';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {searchchatDialogComponent} from "../chat-search-dialog/chat-search-dialog.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AddpartnerDialogComponent} from "../partner-add/partner-add.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class chatComponent implements OnInit {
  chats: Array<chatInput>;
  userId: string;
  user_id: number;
  userid_to: number;
  newchatForm: FormGroup;
  method: "add";



  constructor(private http:HttpClient,
              public dialog: MatDialog) {
    this.userId = sessionStorage.getItem('userId')
    }

  ngOnInit(): void {
      this.newchatForm = new FormGroup({
        userid_to: new FormControl()
      });

  }

  load_page(userid_to:number): void{
    this.get_allchat(userid_to).subscribe(results => {
      console.log(results)
      if (results.success) {
        console.log("update chat")
        this.chats = results.data
        console.log(this.chats)
      } else {
        alert("chats Not Found")
      }
    })
  }


  get_allchat(userid_to: number): Observable<any> {
    console.log("search with DB")
    console.log(userid_to)
    return this.http.post<any>(`${environment.ms1Url}/api/user/${this.userId}/chatting/history`, userid_to)

  }

  postSubmit(): void{
    if(this.newchatForm.valid) {
      console.log('Start show chat')
      const userid_to = this.newchatForm.value
      console.log(userid_to)

      if (userid_to) {
        this.get_allchat(userid_to).subscribe(results => {
          if (results.success) {
            console.log('save chat result')
            this.chats = results.data
            console.log(this.chats)

          } else {
            alert("no chat")
          }
        })

      }else{
        alert('Unknown Method')
      }
    }
    else{
      alert("chat-search-dialog requirement not met")
    }
  }

  AddchatDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      method: 'add',
      userid_from: this.userId
    }

    let dialogRef = this.dialog.open(searchchatDialogComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(results => {
      console.log(results)
      alert("Succeed!")
    })
  }






}

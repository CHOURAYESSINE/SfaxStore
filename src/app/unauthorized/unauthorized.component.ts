import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-unauthorized',
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {}

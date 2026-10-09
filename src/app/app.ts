import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { DebugService } from './services/debug.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly debug = inject(DebugService);

  protected readonly backendHello = toSignal(
    this.debug.hello().pipe(
      map((text) => ({ text, error: null as string | null })),
      catchError((err: unknown) => of({ text: null, error: describe(err) })),
      startWith({ text: null, error: null }),
    ),
    { requireSync: true },
  );
}

function describe(err: unknown): string {
  if (err && typeof err === 'object' && 'status' in err) {
    const status = (err as { status: number }).status;
    return status === 0 ? 'Backend unreachable (network/CORS)' : `HTTP ${status}`;
  }
  return 'Unknown error';
}

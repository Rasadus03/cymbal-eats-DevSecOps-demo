/* document-load.ts|js file - the code snippet is the same for both the languages */
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import {
    ConsoleSpanExporter,
    SimpleSpanProcessor,
  } from '@opentelemetry/sdk-trace-base';
const provider = new WebTracerProvider({
    spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
  });

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation(),
    new UserInteractionInstrumentation(),
    new XMLHttpRequestInstrumentation(),
  ],
});

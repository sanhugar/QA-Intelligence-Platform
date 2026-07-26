# @ati/errors

Stable application error taxonomy (`AppError`, shared codes) and mapping helpers.

Host-specific errors (e.g. `SharedServiceError`, `AiRuntimeError`) should **extend** `AppError`.

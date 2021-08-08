CREATE TABLE ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY
(
   AIRLN_ACCT_CD        CHAR(3)                        NOT NULL,
   ELEC_MISC_DOC_ID     DECIMAL(15)                    NOT NULL,
   LOCAL_DOC_ISSUE_DT   DATE                           NOT NULL,
   SYS_DOC_LAST_UPDT_DT DATE                           NOT NULL,
   SYS_DOC_LAST_UPDT_TM TIME(0)                        NOT NULL,
   HIST_SEQ_NBR_SUM_QTY INTEGER                        NOT NULL,
   MSG_ID               BYTE(24),
   MSG_PUTDATE          CHAR(8),
   MSG_PUTTIME          CHARACTER(8),
   PARSED_MSG_IND       CHARACTER(1),
   BATCH_ID             DECIMAL(18, 0)                 NOT NULL,
   JOB_ID               INTEGER                        NOT NULL,
   RUN_ID               SMALLINT                       NOT NULL
)
   unique primary index EMD_MQ_UPI(
      AIRLN_ACCT_CD,ELEC_MISC_DOC_ID,LOCAL_DOC_ISSUE_DT,SYS_DOC_LAST_UPDT_DT,SYS_DOC_LAST_UPDT_TM,HIST_SEQ_NBR_SUM_QTY
   );

COMMENT ON TABLE ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY IS
'This table is used to store the stats of incoming MQ message and used for re-conciliation purposes.';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.AIRLN_ACCT_CD IS
'Numeric Code used to uniquely identify an airline for accounting purposes. Example AA=001(without check digit). Part of document number - The airline accounting code which is also the first 3 digits in the document number.';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.ELEC_MISC_DOC_ID IS
'True document identifier. Its often combined with the form, serial number, and check digit number to make it complete.';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.LOCAL_DOC_ISSUE_DT IS
'Local date when the ticketing document was issued in the agent''''s city.';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.SYS_DOC_LAST_UPDT_DT IS
'The date when the ticketing document was last updated in the host system.';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.SYS_DOC_LAST_UPDT_TM IS
'The time when the ticketing document was last updated in the host system.';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.HIST_SEQ_NBR_SUM_QTY IS
'History Sequence Number Sum Quantity';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.MSG_ID IS
'Message Identifier of incoming MQ message';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.MSG_PUT_DT IS
'Message Put Date of MQ message';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.MSG_PUT_TM IS
'Message Put Time of MQ message';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.PARSED_MSG_IND IS
'Parsed Message Indicator ';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.BATCH_ID IS
'Fixed Integer Value, set at the time of Job Registration';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.JOB_ID IS
'Fixed Integer Value, set at the time of Job Registration';

COMMENT ON COLUMN ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY.RUN_ID IS
'A sequence number, incremented for each run of a job.  Each batch may contain many jobs.  Each job may be run many times.';

CREATE INDEX  EMD_MQ_MSG_NUSI(MSG_ID,MSG_PUT_DT,MSG_PUT_TM)
   ON ${ENV}_MOSAICRLTM_DB.EMD_MQ_MSG_KEY;
